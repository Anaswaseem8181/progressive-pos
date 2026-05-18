import User from '../models/User.js';
import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, businessName, businessCategory, currency, contactNumber, storeAddress } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
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
      role: 'admin', // First registered user is always admin
      adminEmail: email,
    });

    // Create a default Walk-in Customer for the new business
    await Customer.create({
      name: 'Walk-in Customer',
      phone: '00000000000',
      status: 'REGULAR',
      adminEmail: email,
      isWalkIn: true
    });

    if (user) {
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
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if user is active and has paid (if admin)
      if (user.role === 'admin' && user.billingStatus === 'unpaid') {
        return res.status(403).json({ 
          success: false, 
          message: 'Account activation required. Please complete your subscription payment.',
          needsPayment: true 
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({ 
          success: false, 
          message: `Your account is ${user.status}. Please contact your administrator.` 
        });
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
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
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
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user subscription status
// @route   PUT /api/auth/subscribe
// @access  Private
export const updateSubscription = async (req, res, next) => {
  try {
    const { plan, status } = req.body;
    console.log('Update Subscription Request:', { plan, status, userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (user) {
      user.subscriptionPlan = plan || user.subscriptionPlan;
      user.billingStatus = status || 'active';
      await user.save();

      res.json({
        success: true,
        message: 'Subscription updated successfully',
        subscriptionPlan: user.subscriptionPlan,
        billingStatus: user.billingStatus,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
