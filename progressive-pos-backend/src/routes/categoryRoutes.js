import express from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  archiveCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCategoryRules,
  updateCategoryRules,
  archiveCategoryRules,
} from '../validators/categoryValidator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getCategories).post(createCategoryRules, addCategory);
router.route('/:id').put(updateCategoryRules, updateCategory);
router.route('/:id/archive').put(archiveCategoryRules, archiveCategory);

export default router;
