import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { register, login, getUserProfile, updateSubscription, changePassword, updateBusinessInfo, removeLogo } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { registerRules, loginRules, subscribeRules, changePasswordRules, updateBusinessInfoRules } from '../validators/authValidator.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

const changePasswordLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const userId = req.user ? req.user._id.toString() : 'anonymous';
    return `${userId}-${ipKeyGenerator(req.ip)}`;
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

// Business Info Routes (Admin Only)
router.put(
  '/business-info', 
  protect, 
  authorize('admin'), 
  upload.single('logo'), 
  updateBusinessInfoRules, 
  updateBusinessInfo
);

router.delete(
  '/business-info/logo', 
  protect, 
  authorize('admin'), 
  removeLogo
);

export default router;
