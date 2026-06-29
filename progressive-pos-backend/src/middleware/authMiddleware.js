import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  // Check if password was changed after token was issued (with 5s clock skew tolerance)
  if (req.user.passwordChangedAt) {
    const changedSeconds = parseInt(req.user.passwordChangedAt.getTime() / 1000, 10);
    if (changedSeconds > (decoded.iat - 5)) {
      res.status(401);
      throw new Error('Password was changed recently. Please login again.');
    }
  }

  // Check user status
  if (req.user.status !== 'active') {
    res.status(403);
    throw new Error(`Account is ${req.user.status}. Please contact your administrator.`);
  }

  // Verify subscription status for Admin users (Defense-in-Depth Payment Wall)
  // Exclude the /subscribe endpoint so unpaid users can hit it to complete their Stripe payments
  if (
    req.user.role === 'admin' &&
    req.user.billingStatus !== 'active' &&
    !req.originalUrl.includes('/subscribe')
  ) {
    res.status(402); // 402 Payment Required
    throw new Error('Subscription payment required to access this resource');
  }

  next();
});
