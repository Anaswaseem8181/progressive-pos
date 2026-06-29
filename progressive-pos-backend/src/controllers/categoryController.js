import asyncHandler from '../utils/asyncHandler.js';
import { categoryService } from '../services/index.js';

export const getCategories = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const categories = await categoryService.listCategories(businessId);

  res.json({ success: true, count: categories.length, data: categories });
});

export const addCategory = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const category = await categoryService.createCategory({
    ...req.body,
    businessId,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const category = await categoryService.updateCategory(req.params.id, businessId, req.body);

  res.json({ success: true, data: category });
});

export const archiveCategory = asyncHandler(async (req, res) => {
  const businessId = req.user.businessId || req.user._id;
  const result = await categoryService.archiveCategory(req.params.id, businessId);

  res.json({ success: true, ...result });
});
