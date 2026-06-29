import asyncHandler from '../utils/asyncHandler.js';
import { productService } from '../services/index.js';

export const getProducts = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const isDeleted = req.query.isDeleted === 'true';
  const products = await productService.listProducts(businessId, isDeleted);

  res.json({ success: true, count: products.length, data: products });
});

export const addProduct = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const product = await productService.createProduct({
    ...req.body,
    businessId,
  });

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const product = await productService.updateProduct(req.params.id, businessId, req.body);

  res.json({ success: true, data: product });
});

export const updateVariantStock = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const { variantId, quantity } = req.body;
  const product = await productService.updateVariantStock(req.params.id, businessId, variantId, quantity);

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const result = await productService.softDeleteProduct(req.params.id, businessId);

  res.json({ success: true, ...result });
});

export const restoreProduct = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const product = await productService.restoreProduct(req.params.id, businessId);

  res.json({ success: true, message: 'Product restored successfully', data: product });
});
