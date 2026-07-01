import Customer from '../models/Customer.js';
import AppError from '../utils/AppError.js';

function resolveAdminEmail(user) {
  return user.role === 'admin' ? user.email : user.adminEmail;
}

async function ensureWalkInCustomer(adminEmail) {
  let walkIn = await Customer.findOne({ adminEmail, isWalkIn: true });
  if (!walkIn) {
    walkIn = await Customer.create({
      name: 'Walk-in Customer',
      phone: 'WALK_IN',
      status: 'REGULAR',
      adminEmail,
      isWalkIn: true,
    });
  } else if (walkIn.phone !== 'WALK_IN') {
    walkIn.phone = 'WALK_IN';
    await walkIn.save();
  }
  return walkIn;
}

async function findOwnedCustomer(customerId, adminEmail) {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new AppError('Customer not found', 404);
  }
  if (customer.adminEmail !== adminEmail) {
    throw new AppError('Not authorized to update this customer', 403);
  }
  return customer;
}

export const listCustomers = async (user, search) => {
  const adminEmail = resolveAdminEmail(user);

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

  return customers;
};

export const createCustomer = async ({ name, phone, status, adminEmail }) => {
  const customerExists = await Customer.findOne({ phone, adminEmail });
  if (customerExists) {
    throw new AppError('A customer with this phone number already exists', 400);
  }

  const customer = await Customer.create({
    name,
    phone,
    status: status || 'REGULAR',
    adminEmail,
  });

  return customer;
};

export const updateCustomer = async (customerId, adminEmail, { name, phone, status }) => {
  const customer = await findOwnedCustomer(customerId, adminEmail);

  if (customer.isWalkIn) {
    throw new AppError('Default walk-in customer cannot be modified', 400);
  }

  if (phone && phone !== customer.phone) {
    const phoneExists = await Customer.findOne({ phone, adminEmail, _id: { $ne: customerId } });
    if (phoneExists) {
      throw new AppError('Another customer with this phone number already exists', 400);
    }
  }

  customer.name = name || customer.name;
  customer.phone = phone || customer.phone;
  customer.status = status || customer.status;
  await customer.save();

  return customer;
};

export const deleteCustomer = async (customerId, adminEmail) => {
  const customer = await findOwnedCustomer(customerId, adminEmail);

  if (customer.isWalkIn) {
    throw new AppError('Default walk-in customer cannot be deleted', 400);
  }

  await Customer.findByIdAndDelete(customerId);

  return { message: 'Customer removed successfully' };
};
