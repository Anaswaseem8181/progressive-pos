import mongoose from 'mongoose';
import User from '../models/User.js';
import Customer from '../models/Customer.js';

/**
 * Registers a new Admin and automatically creates a default Walk-in Customer.
 * Utilizes a MongoDB transaction for atomicity. Fallback to manual rollback
 * is implemented for standalone local MongoDB instances that do not support transactions.
 * 
 * @param {Object} userData - The user registration data
 * @returns {Promise<Object>} The created User document
 */
export const registerAdminWithWalkIn = async (userData) => {
  let session = null;
  
  try {
    session = await mongoose.startSession();
  } catch (sessionError) {
    // Sessions not supported by the current MongoDB deployment (e.g., standalone dev instance)
    session = null;
  }

  if (session) {
    session.startTransaction();
    try {
      const user = await User.create([userData], { session });
      const createdUser = user[0];

      await Customer.create(
        [
          {
            name: 'Walk-in Customer',
            phone: `walkin-${createdUser.email}`,
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
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } else {
    // Fallback: Manual atomic emulation for standalone MongoDB deployments
    const createdUser = await User.create(userData);
    
    try {
      await Customer.create({
        name: 'Walk-in Customer',
        phone: `walkin-${createdUser.email}`,
        status: 'REGULAR',
        adminEmail: createdUser.email,
        isWalkIn: true,
      });
    } catch (customerError) {
      // Rollback the created user to maintain data consistency
      await User.findByIdAndDelete(createdUser._id);
      throw customerError;
    }

    return createdUser;
  }
};
