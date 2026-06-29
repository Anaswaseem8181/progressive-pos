import asyncHandler from '../utils/asyncHandler.js';
import { customerService } from '../services/index.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const customers = await customerService.listCustomers(req.user, search);

  res.json({ success: true, count: customers.length, data: customers });
});

export const addCustomer = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const customer = await customerService.createCustomer({
    ...req.body,
    adminEmail,
  });

  res.status(201).json({ success: true, data: customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const customer = await customerService.updateCustomer(req.params.id, adminEmail, req.body);

  res.json({ success: true, data: customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
  const result = await customerService.deleteCustomer(req.params.id, adminEmail);

  res.json({ success: true, ...result });
});
