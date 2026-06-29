import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  updateVariantStock,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createProductRules,
  updateProductRules,
  updateVariantStockRules,
  deleteProductRules,
  restoreProductRules,
} from '../validators/productValidator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getProducts).post(createProductRules, addProduct);
router.route('/:id').put(updateProductRules, updateProduct).delete(deleteProductRules, deleteProduct);
router.route('/:id/restore').post(restoreProductRules, restoreProduct);
router.route('/:id/variant-stock').patch(updateVariantStockRules, updateVariantStock);

export default router;
