import express from 'express';
import { getStaff, addStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createStaffRules, updateStaffRules, deleteStaffRules } from '../validators/staffValidator.js';

const router = express.Router();

router.use(protect);

router.get('/', getStaff);
router.post('/', createStaffRules, addStaff);
router.put('/:id', updateStaffRules, updateStaff);
router.delete('/:id', deleteStaffRules, deleteStaff);

export default router;
