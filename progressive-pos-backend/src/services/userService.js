import mongoose from 'mongoose';
import User from '../models/User.js';
import Customer from '../models/Customer.js';

/**
 * Registers a new Admin and automatically creates a default Walk-in Customer.
 * Utilizes a MongoDB transaction for atomicity. Fallback to manual rollback
 * is triggered if transactions/sessions/retryable writes are unsupported by the MongoDB deployment.
 */
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
        // Suppress secondary errors during rollback
      }
      session.endSession();
    }

    // Detect if the error is due to MongoDB deployment limitations (no replica sets, retryable writes, etc.)
    const isTxnUnsupported = 
      error.message.includes('transaction') ||
      error.message.includes('session') ||
      error.message.includes('replica set') ||
      error.message.includes('retryable writes') ||
      error.code === 20 || // IllegalOperation
      error.code === 251;  // NoSuchTransaction

    if (isTxnUnsupported) {
      useFallback = true;
    } else {
      // Re-throw genuine validation/business errors
      throw error;
    }
  }

  // Fallback: Emulated atomicity (manual cleanup) for standalone local MongoDB instances
  if (useFallback) {
    const createdUser = await User.create(userData);

    try {
      await Customer.create({
        name: 'Walk-in Customer',
        phone: 'WALK_IN',
        status: 'REGULAR',
        adminEmail: createdUser.email,
        isWalkIn: true,
      });
    } catch (customerError) {
      // Rollback user creation to maintain strict data consistency
      await User.findByIdAndDelete(createdUser._id);
      throw customerError;
    }

    return createdUser;
  }
};
