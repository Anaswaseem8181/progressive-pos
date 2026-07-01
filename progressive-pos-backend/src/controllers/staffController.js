import asyncHandler from '../utils/asyncHandler.js';
import { staffService } from '../services/index.js';

export const getStaff = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const staff = await staffService.listStaff(adminEmail);

  res.json({ success: true, count: staff.length, data: staff });
});

export const addStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.createStaff(req.user, req.body);

  res.status(201).json({ success: true, data: staff });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const staff = await staffService.updateStaff(adminEmail, req.params.id, req.body);

  res.json({ success: true, data: staff });
});

export const deleteStaff = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const result = await staffService.deleteStaff(adminEmail, req.params.id);

  res.json({ success: true, ...result });
});
