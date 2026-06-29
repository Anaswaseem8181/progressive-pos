import mongoose from 'mongoose';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Category from '../models/Category.js';

export const registerAdminWithWalkIn = async (userData) => {
  let session = null;
  let useFallback = false;

  try {
    session = await mongoose.startSession();
    if (session) {
      session.startTransaction();
      const user = await User.create([userData], { session });
      const createdUser = user[0];

      await Customer.create(
        [
          {
            name: 'Walk-in Customer',
            phone: 'WALK_IN',
            status: 'REGULAR',
            adminEmail: createdUser.email,
            isWalkIn: true,
          },
        ],
        { session }
      );

      await Category.create(
        [
          {
            name: createdUser.businessCategory || 'General',
            description: 'Default category',
            businessId: createdUser._id,
            createdBy: createdUser._id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return createdUser;
    } else {
      useFallback = true;
    }
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        // Suppress secondary errors
      }
      session.endSession();
    }

    const isTxnUnsupported = 
      error.message.includes('transaction') ||
      error.message.includes('session') ||
      error.message.includes('replica set') ||
      error.message.includes('retryable writes') ||
      error.code === 20 || 
      error.code === 251;

    if (isTxnUnsupported) {
      useFallback = true;
    } else {
      throw error;
    }
  }

  // Fallback: Manual cleanup logic fixed completely
  if (useFallback) {
    const createdUser = await User.create(userData);
    let createdCustomer = null;

    try {
      createdCustomer = await Customer.create({
        name: 'Walk-in Customer',
        phone: 'WALK_IN',
        status: 'REGULAR',
        adminEmail: createdUser.email,
        isWalkIn: true,
      });

      await Category.create({
        name: createdUser.businessCategory || 'General',
        description: 'Default category',
        businessId: createdUser._id,
        createdBy: createdUser._id,
      });
    } catch (fallbackError) {
      // FIX: User ke sath sath Customer ko bhi delete karein agar Category fail ho jaye
      await User.findByIdAndDelete(createdUser._id);
      if (createdCustomer) {
        await Customer.findByIdAndDelete(createdCustomer._id);
      }
      throw fallbackError;
    }

    return createdUser;
  }
};