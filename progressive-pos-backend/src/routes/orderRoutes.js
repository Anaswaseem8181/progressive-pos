import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderStats,
  getReportStats,
  getTopSelling,
  getOrderHistory,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Specific named routes must come BEFORE parameterized routes
router.get('/stats', getOrderStats);
router.get('/report-stats', getReportStats);
router.get('/top-selling', getTopSelling);
router.get('/history', getOrderHistory);

router.route('/').get(getOrders).post(createOrder);

export default router;

