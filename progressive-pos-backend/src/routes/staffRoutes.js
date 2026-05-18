import express from 'express';
import { getStaff, addStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All staff routes are protected
router.use(protect);

router.get('/', getStaff);
router.post('/', addStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
