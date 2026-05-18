import express from 'express';
import { register, login, getMe, updateSubscription } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/subscribe', protect, updateSubscription);

export default router;
