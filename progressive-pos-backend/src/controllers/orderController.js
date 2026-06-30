import asyncHandler from '../utils/asyncHandler.js';
import * as orderService from '../services/orderService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const { customerId, items, billedBy } = req.body;

  const order = await orderService.createOrder({
    businessId,
    customerId,
    items,
    billedBy: billedBy || `${req.user.name} (${req.user.role})`,
  });

  res.status(201).json({ success: true, data: order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const limit = parseInt(req.query.limit) || 20;
  const { customerId } = req.query;

  const orders = await orderService.getOrders(businessId, limit, customerId);

  res.json({ success: true, count: orders.length, data: orders });
});

export const getOrderStats = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;

  const stats = await orderService.getOrderStats(businessId);

  res.json({ success: true, data: stats });
});

/**
 * GET /api/orders/report-stats?startDate=&endDate=
 * Date-filtered stats: revenue, orders, discounts.
 */
export const getReportStats = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const { startDate, endDate } = req.query;

  const stats = await orderService.getReportStats(businessId, startDate, endDate);

  res.json({ success: true, data: stats });
});

/**
 * GET /api/orders/top-selling?startDate=&endDate=&limit=
 */
export const getTopSelling = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const { startDate, endDate } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  const products = await orderService.getTopSellingProducts(businessId, startDate, endDate, limit);

  res.json({ success: true, data: products });
});

/**
 * GET /api/orders/history?startDate=&endDate=
 * Date-filtered sales history.
 */
export const getOrderHistory = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const { startDate, endDate } = req.query;
  const limit = parseInt(req.query.limit) || 50;

  const orders = await orderService.getFilteredOrders(businessId, startDate, endDate, limit);

  res.json({ success: true, count: orders.length, data: orders });
});

