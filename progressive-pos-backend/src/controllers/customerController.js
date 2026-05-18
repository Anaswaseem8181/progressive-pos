import Customer from '../models/Customer.js';
import asyncHandler from '../utils/asyncHandler.js';

const resolveAdminEmail = (user) =>
  user.role === 'admin' ? user.email : user.adminEmail;

const ensureWalkInCustomer = async (adminEmail) => {
  let walkIn = await Customer.findOne({ adminEmail, isWalkIn: true });
  if (!walkIn) {
    walkIn = await Customer.create({
      name: 'Walk-in Customer',
      phone: `walkin-${adminEmail}`,
      status: 'REGULAR',
      adminEmail,
      isWalkIn: true,
    });
  }
  return walkIn;
};

export const getCustomers = asyncHandler(async (req, res) => {
  const adminEmail = resolveAdminEmail(req.user);
  const { search } = req.query;

  const walkIn = await ensureWalkInCustomer(adminEmail);

  const query = { adminEmail };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  let customers = await Customer.find(query).limit(20).sort({ createdAt: -1 });

  if (!search) {
    customers = customers.filter((c) => c._id.toString() !== walkIn._id.toString());
    customers.unshift(walkIn);
  } else {
    const walkInIndex = customers.findIndex((c) => c._id.toString() === walkIn._id.toString());
    if (walkInIndex > 0) {
      customers.splice(walkInIndex, 1);
      customers.unshift(walkIn);
    }
  }

  res.json({ success: true, count: customers.length, data: customers });
});

export const addCustomer = asyncHandler(async (req, res) => {
  const { name, phone, status } = req.body;
  const adminEmail = resolveAdminEmail(req.user);

  // check if customer with same phone already exists for this admin
  const customerExists = await Customer.findOne({ phone, adminEmail });
  if (customerExists) {
    res.status(400);
    throw new Error('A customer with this phone number already exists');
  }

  const customer = await Customer.create({
    name,
    phone,
    status: status || 'REGULAR',
    adminEmail,
  });

  res.status(201).json({ success: true, data: customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, phone, status } = req.body;
  const adminEmail = resolveAdminEmail(req.user);

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  if (customer.adminEmail !== adminEmail) {
    res.status(403);
    throw new Error('Not authorized to update this customer');
  }

  // Prevent editing the default walk-in customer
  if (customer.isWalkIn) {
    res.status(400);
    throw new Error('Default walk-in customer cannot be modified');
  }

  if (phone && phone !== customer.phone) {
    const phoneExists = await Customer.findOne({ phone, adminEmail, _id: { $ne: req.params.id } });
    if (phoneExists) {
      res.status(400);
      throw new Error('Another customer with this phone number already exists');
    }
  }

  customer.name = name || customer.name;
  customer.phone = phone || customer.phone;
  customer.status = status || customer.status;
  await customer.save();

  res.json({ success: true, data: customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const adminEmail = resolveAdminEmail(req.user);
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Ensure this customer belongs to the admin
  if (customer.adminEmail !== adminEmail) {
    res.status(403);
    throw new Error('Not authorized to delete this customer');
  }

  // Prevent deleting the default walk-in customer
  if (customer.isWalkIn) {
    res.status(400);
    throw new Error('Default walk-in customer cannot be deleted');
  }

  await Customer.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Customer removed successfully' });
});
