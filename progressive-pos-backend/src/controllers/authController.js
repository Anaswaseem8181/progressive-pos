import asyncHandler from '../utils/asyncHandler.js';
import { authService } from '../services/index.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({ success: true, ...user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);

  res.json({ success: true, ...user });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);

  res.json({ success: true, ...user });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const { plan, paymentMethodId } = req.body;
  const result = await authService.updateSubscription(req.user._id, plan, paymentMethodId);

  res.json({
    success: true,
    message: 'Payment completed and subscription activated successfully',
    ...result,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);

  res.json({
    success: true,
    message: 'Password updated successfully',
    ...result,
  });
});

export const updateBusinessInfo = asyncHandler(async (req, res) => {
  // Pass req.body and req.file (if any) to the service
  const result = await authService.updateBusinessInfo(req.user._id, req.body, req.file);

  res.json({
    success: true,
    message: 'Business information updated successfully',
    data: result,
  });
});

export const removeLogo = asyncHandler(async (req, res) => {
  const result = await authService.removeLogo(req.user._id);

  res.json({
    success: true,
    message: 'Logo removed successfully',
    data: result,
  });
});
