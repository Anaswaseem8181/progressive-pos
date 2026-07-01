import express from 'express';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCustomerRules,
  updateCustomerRules,
  deleteCustomerRules,
} from '../validators/customerValidator.js';

const router = express.Router();

const sanitizeSearch = (req, res, next) => {
  if (req.query.search) {
    req.query.search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  next();
};

router.route('/')
  .get(protect, sanitizeSearch, getCustomers)
  .post(protect, createCustomerRules, addCustomer);

router.route('/:id')
  .put(protect, updateCustomerRules, updateCustomer)
  .delete(protect, deleteCustomerRules, deleteCustomer);

export default router;
