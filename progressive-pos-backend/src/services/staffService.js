import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const listStaff = async (adminEmail) => {
  const staff = await User.find({
    adminEmail,
    email: { $ne: adminEmail },
  }).select('-password');

  return staff;
};

export const createStaff = async (adminUser, { name, email, password, role, contactNumber }) => {
  if (adminUser.role !== 'admin') {
    throw new AppError('Only admins can add staff', 403);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('A user with this email already exists', 400);
  }

  const staff = await User.create({
    name,
    email,
    password,
    role,
    contactNumber,
    businessName: adminUser.businessName,
    businessCategory: adminUser.businessCategory,
    currency: adminUser.currency,
    adminEmail: adminUser.email,
    businessId: adminUser.businessId || adminUser._id,
    billingStatus: 'active',
    emailVerified: true,
  });

  return {
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    contactNumber: staff.contactNumber,
  };
};

export const updateStaff = async (adminEmail, staffId, { name, email, role, contactNumber, password, status }) => {
  const staff = await User.findById(staffId);

  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  if (staff.adminEmail !== adminEmail) {
    throw new AppError('Not authorized to update this staff member', 403);
  }

  staff.name = name || staff.name;
  staff.email = email || staff.email;
  staff.role = role || staff.role;
  staff.contactNumber = contactNumber || staff.contactNumber;
  staff.status = status || staff.status;

  if (password) {
    staff.password = password;
  }

  await staff.save();

  return {
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    contactNumber: staff.contactNumber,
  };
};

export const deleteStaff = async (adminEmail, staffId) => {
  const staff = await User.findById(staffId);

  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  if (staff.adminEmail !== adminEmail) {
    throw new AppError('Not authorized to delete this staff member', 403);
  }

  await User.findByIdAndDelete(staffId);

  return { message: 'Staff member removed successfully' };
};
