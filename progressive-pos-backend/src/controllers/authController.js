import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { registerAdminWithWalkIn } from '../services/userService.js';
import Stripe from 'stripe';

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

  // Delegate creation to service layer to guarantee user + default walk-in customer creation atomicity
  const user = await registerAdminWithWalkIn({
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
// Update user subscription status with Stripe Payment Validation
export const updateSubscription = asyncHandler(async (req, res) => {
  const { plan, paymentMethodId } = req.body;

  if (!paymentMethodId) {
    res.status(400);
    throw new Error('Payment method ID is required');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Calculate pricing (Stripe expects amounts in cents)
  let amountInCents = 15000; // Default Monthly ($150.00)
  if (plan === 'yearly') {
    amountInCents = 160000;  // Yearly ($1600.00)
  }

  // Initialize Stripe using the secret key from env variables
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Create and confirm PaymentIntent instantly
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      description: `Progressive POS SaaS - ${plan === 'yearly' ? 'Yearly' : 'Monthly'} Subscription for ${user.email}`,
      metadata: {
        userId: user._id.toString(),
        email: user.email,
        plan: plan || 'monthly',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }

    // Activate the subscription in the database upon successful Stripe transaction
    user.subscriptionPlan = plan || 'monthly';
    user.billingStatus = 'active';
    user.emailVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Payment completed and subscription activated successfully',
      subscriptionPlan: user.subscriptionPlan,
      billingStatus: user.billingStatus,
    });
  } catch (stripeError) {
    res.status(400);
    throw new Error(stripeError.message || 'Payment processing failed');
  }
});
