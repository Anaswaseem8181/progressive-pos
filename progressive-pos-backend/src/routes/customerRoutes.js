import express from 'express';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCustomers)
  .post(protect, addCustomer);

router.route('/:id')
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

export default router;
