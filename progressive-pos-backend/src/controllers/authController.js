import User from '../models/User.js';
import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, businessName, businessCategory, currency, contactNumber, storeAddress } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    businessName,
    businessCategory,
    currency,
    contactNumber,
    storeAddress,
    role: 'admin',
    adminEmail: email,
  });

  // Create a default Walk-in Customer for the new business
  await Customer.create({
    name: 'Walk-in Customer',
    phone: '00000000000',
    status: 'REGULAR',
    adminEmail: email,
    isWalkIn: true,
  });

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    currency: user.currency,
    contactNumber: user.contactNumber,
    storeAddress: user.storeAddress,
    token: generateToken(user._id),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');
  // Check if user is active and has paid (if admin)
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.role === 'admin' && user.billingStatus === 'unpaid') {
    res.status(403);
    throw Object.assign(new Error('Account activation required. Please complete your subscription payment.'), { needsPayment: true });
  }

  // Check if user is active
  if (user.status !== 'active') {
    res.status(403);
    throw new Error(`Your account is ${user.status}. Please contact your administrator.`);
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    currency: user.currency,
    storeAddress: user.storeAddress,
    contactNumber: user.contactNumber,
    billingStatus: user.billingStatus,
    status: user.status,
    lastLogin: user.lastLogin,
    token: generateToken(user._id),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    currency: user.currency,
    storeAddress: user.storeAddress,
    contactNumber: user.contactNumber,
  });
});
// Update user subscription status
export const updateSubscription = asyncHandler(async (req, res) => {
  const { plan, status } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.subscriptionPlan = plan || user.subscriptionPlan;
  user.billingStatus = status || 'active';
  await user.save();

  res.json({
    success: true,
    message: 'Subscription updated successfully',
    subscriptionPlan: user.subscriptionPlan,
    billingStatus: user.billingStatus,
  });
});
