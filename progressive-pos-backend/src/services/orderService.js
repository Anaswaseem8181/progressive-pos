import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

/**
 * Create an order:
 * 1. Validate stock availability for all items
 * 2. Create the order document
 * 3. Deduct variant stock from each product (with optimistic concurrency check)
 *
 * NOTE: Transactions are intentionally not used here because the local
 * MongoDB instance runs as a standalone server (not a replica set).
 * The stock deduction uses a conditional $gte filter to prevent overselling.
 */
export const createOrder = async ({ businessId, customerId, items, billedBy }) => {
  // --- Step 1: Validate stock for all items ---
  for (const item of items) {
    const product = await Product.findOne(
      { _id: item.productId, businessId, isDeleted: false }
    );

    if (!product) {
      throw new AppError(`Product not found: ${item.name}`, 404);
    }

    const variant = product.variants.id(item.variantId);
    if (!variant) {
      throw new AppError(`Variant not found for product: ${item.name}`, 404);
    }

    if (variant.stock < item.qty) {
      throw new AppError(
        `Insufficient stock for "${item.name} (${variant.size})". Available: ${variant.stock}, Requested: ${item.qty}`,
        400
      );
    }
  }

  // --- Step 2: Calculate total and create the order ---
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [order] = await Order.create([
    {
      businessId,
      customerId: customerId || null,
      items,
      totalAmount,
      billedBy,
    },
  ]);

  // --- Step 3: Deduct stock from each variant (optimistic) ---
  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: item.productId,
        businessId,
        'variants._id': item.variantId,
        'variants.stock': { $gte: item.qty },
      },
      { $inc: { 'variants.$.stock': -item.qty } }
    );

    if (result.modifiedCount === 0) {
      // Stock was already insufficient — roll back the order
      await Order.findByIdAndDelete(order._id);
      throw new AppError(
        `Insufficient stock for "${item.name} (${item.size})". Order cancelled.`,
        400
      );
    }
  }

  return order;
};

/**
 * List recent orders for a business, newest first.
 * Optionally filter by customerId.
 */
export const getOrders = async (businessId, limit = 20, customerId = null) => {
  const query = { businessId };
  if (customerId) {
    query.customerId = customerId;
  }
  return Order.find(query)
    .populate('customerId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Aggregate dashboard stats: total revenue and total order count.
 */
export const getOrderStats = async (businessId) => {
  const [result] = await Order.aggregate([
    { $match: { businessId: new mongoose.Types.ObjectId(businessId) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return {
    totalRevenue: result?.totalRevenue ?? 0,
    totalOrders: result?.totalOrders ?? 0,
  };
};

/**
 * Date-filtered report stats: revenue, order count.
 * Discounts are not stored on orders yet — returns 0 until a discount field is added to the model.
 */
export const getReportStats = async (businessId, startDate, endDate) => {
  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      },
    }),
  };

  const [result] = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        totalDiscount: { $sum: { $ifNull: ['$discountAmount', 0] } },
      },
    },
  ]);

  return {
    totalRevenue: result?.totalRevenue ?? 0,
    totalOrders: result?.totalOrders ?? 0,
    totalDiscount: result?.totalDiscount ?? 0,
  };
};

/**
 * Aggregate top selling products by qty sold and revenue.
 */
export const getTopSellingProducts = async (businessId, startDate, endDate, limit = 10) => {
  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      },
    }),
  };

  return Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        totalQty: { $sum: '$items.qty' },
        totalRevenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
      },
    },
    { $sort: { totalQty: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        name: 1,
        sold: '$totalQty',
        revenue: '$totalRevenue',
      },
    },
  ]);
};

/**
 * Date-filtered orders list for sales history.
 */
export const getFilteredOrders = async (businessId, startDate, endDate, limit = 50) => {
  const query = {
    businessId,
    ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      },
    }),
  };

  return Order.find(query)
    .populate('customerId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
