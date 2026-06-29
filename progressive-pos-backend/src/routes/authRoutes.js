import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getUserProfile, updateSubscription, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerRules, loginRules, subscribeRules, changePasswordRules } from '../validators/authValidator.js';

const router = express.Router();

const changePasswordLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests
  keyGenerator: (req) => {
    const userId = req.user ? req.user._id.toString() : 'anonymous';
    return `${userId}-${req.ip}`;
  },
  message: {
    success: false,
    message: 'Too many password change attempts. Please try again after a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/profile', protect, getUserProfile);
router.put('/subscribe', protect, subscribeRules, updateSubscription);
router.put('/change-password', protect, changePasswordLimiter, changePasswordRules, changePassword);

export default router;
