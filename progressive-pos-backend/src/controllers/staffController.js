import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all staff for an admin
// @route   GET /api/staff
// @access  Private (Admin/Manager)
export const getStaff = async (req, res) => {
  try {
    // Staff are linked via adminEmail
    const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
    
    // Find all users where adminEmail matches, excluding the admin themselves
    const staff = await User.find({ 
      adminEmail,
      email: { $ne: adminEmail } 
    }).select('-password');

    res.json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new staff member
// @route   POST /api/staff
// @access  Private (Admin only)
export const addStaff = async (req, res) => {
  try {
    const { name, email, password, role, contactNumber } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can add staff' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
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
      billingStatus: 'active', // Staff don't pay, they use admin's subscription
      emailVerified: true
    });

    res.status(201).json({
      success: true,
      data: {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        contactNumber: staff.contactNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private (Admin only)
export const updateStaff = async (req, res) => {
  try {
    const { name, email, role, contactNumber, password, status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can update staff' });
    }

    let staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Ensure this staff belongs to the admin
    if (staff.adminEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this staff member' });
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
        contactNumber: staff.contactNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin only)
export const deleteStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete staff' });
    }

    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Ensure this staff belongs to the admin
    if (staff.adminEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this staff member' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Staff member removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
