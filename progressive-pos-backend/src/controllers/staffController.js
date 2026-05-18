import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getStaff = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;

  // Find all users where adminEmail matches, excluding the admin themselves
  const staff = await User.find({
    adminEmail,
    email: { $ne: adminEmail },
  }).select('-password');

  res.json({ success: true, count: staff.length, data: staff });
});

export const addStaff = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can add staff');
  }

  const { name, email, password, role, contactNumber } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const staff = await User.create({
    name,
    email,
    password,
    role,
    contactNumber,
    businessName: req.user.businessName,
    businessCategory: req.user.businessCategory,
    currency: req.user.currency,
    adminEmail: req.user.email,
    billingStatus: 'active',
    emailVerified: true,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      contactNumber: staff.contactNumber,
    },
  });
});

export const updateStaff = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can update staff');
  }

  const { name, email, role, contactNumber, password, status } = req.body;

  const staff = await User.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // Ensure this staff belongs to the admin
  if (staff.adminEmail !== req.user.email) {
    res.status(403);
    throw new Error('Not authorized to update this staff member');
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

  res.json({
    success: true,
    data: {
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      contactNumber: staff.contactNumber,
    },
  });
});

export const deleteStaff = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can delete staff');
  }

  const staff = await User.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // Ensure this staff belongs to the admin
  if (staff.adminEmail !== req.user.email) {
    res.status(403);
    throw new Error('Not authorized to delete this staff member');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Staff member removed successfully' });
});
