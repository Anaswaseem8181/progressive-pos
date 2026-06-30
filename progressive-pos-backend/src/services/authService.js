import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { generateToken } from '../utils/generateToken.js';
import stripe from '../utils/stripe.js';
import { registerAdminWithWalkIn } from './userService.js';

export const registerUser = async ({ name, email, password, businessName, businessCategory, currency, contactNumber, storeAddress }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('An account with this email already exists', 400);
  }

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

  return {
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
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password').populate('businessId');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const adminInfo = user.businessId || user;

  if (adminInfo.role === 'admin' && adminInfo.billingStatus === 'unpaid') {
    const error = new AppError('Account activation required. Please complete your subscription payment.', 403);
    error.needsPayment = true;
    throw error;
  }

  if (user.status !== 'active') {
    throw new AppError(`Your account is ${user.status}. Please contact your administrator.`, 403);
  }

  const currentTimestamp = Date.now();
  await User.updateOne({ _id: user._id }, { $set: { lastLogin: currentTimestamp } });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: adminInfo.businessName,
    businessCategory: adminInfo.businessCategory,
    currency: adminInfo.currency,
    storeAddress: adminInfo.storeAddress,
    contactNumber: adminInfo.contactNumber,
    logoUrl: adminInfo.logoUrl,
    adminEmail: adminInfo.email,
    billingStatus: adminInfo.billingStatus,
    status: user.status,
    lastLogin: currentTimestamp,
    token: generateToken(user._id),
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate('businessId');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const adminInfo = user.businessId || user;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: adminInfo.businessName,
    businessCategory: adminInfo.businessCategory,
    currency: adminInfo.currency,
    storeAddress: adminInfo.storeAddress,
    contactNumber: adminInfo.contactNumber,
    logoUrl: adminInfo.logoUrl,
    adminEmail: adminInfo.email,
  };
};

export const updateSubscription = async (userId, plan, paymentMethodId) => {
  if (!paymentMethodId) {
    throw new AppError('Payment method ID is required', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  let amountInCents = plan === 'yearly' ? 160000 : 15000;

  try {
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
      throw new AppError(`Payment failed with status: ${paymentIntent.status}`, 400);
    }

    user.subscriptionPlan = plan || 'monthly';
    user.billingStatus = 'active';
    user.emailVerified = true;
    await user.save();

    return {
      subscriptionPlan: user.subscriptionPlan,
      billingStatus: user.billingStatus,
    };
  } catch (stripeError) {
    if (stripeError instanceof AppError) throw stripeError;
    throw new AppError(stripeError.message || 'Payment processing failed', 400);
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.matchPassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  return {
    token: generateToken(user._id),
  };
};

import { deleteImageFromCloudinary, extractPublicId } from '../utils/upload.js';

export const updateBusinessInfo = async (userId, data, file) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  user.businessName = data.businessName || user.businessName;
  user.businessCategory = data.category || user.businessCategory;
  user.storeAddress = data.storeAddress || user.storeAddress;
  user.contactNumber = data.contactNumber || user.contactNumber;
  
  if (file) {
    // Delete old logo if it exists
    if (user.logoUrl) {
      const oldPublicId = extractPublicId(user.logoUrl);
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }
    }
    user.logoUrl = file.path;
  }
  
  await user.save();
  
  // Propagate to other users with same businessId if multi-tenant in future
  
  return {
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    storeAddress: user.storeAddress,
    contactNumber: user.contactNumber,
    logoUrl: user.logoUrl,
  };
};

export const removeLogo = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  if (user.logoUrl) {
    const oldPublicId = extractPublicId(user.logoUrl);
    if (oldPublicId) {
      await deleteImageFromCloudinary(oldPublicId);
    }
    user.logoUrl = '';
    await user.save();
  }
  
  return { logoUrl: user.logoUrl };
};
