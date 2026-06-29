import { body } from 'express-validator';
import { nonEmptyString, positiveNumber, objectIdBody, objectId, optionalString, handleValidationErrors } from './common.js';

export const createProductRules = [
  nonEmptyString('name'),
  optionalString('sku'),
  positiveNumber('price'),
  objectIdBody('categoryId'),
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least one variant is required'),
  body('variants.*.size')
    .trim()
    .notEmpty()
    .withMessage('Variant size is required'),
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Variant stock must be a non-negative integer'),
  handleValidationErrors,
];

export const updateProductRules = [
  objectId(),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('sku').optional().trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('categoryId')
    .optional()
    .isMongoId()
    .withMessage('Invalid categoryId'),
  body('variants')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one variant is required'),
  body('variants.*.size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Variant size cannot be empty'),
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Variant stock must be a non-negative integer'),
  handleValidationErrors,
];

export const updateVariantStockRules = [
  objectId(),
  body('variantId')
    .isMongoId()
    .withMessage('Invalid variantId'),
  body('quantity')
    .isInt({ allow_negative: true })
    .withMessage('Quantity must be an integer'),
  handleValidationErrors,
];

export const deleteProductRules = [
  objectId(),
  handleValidationErrors,
];

export const restoreProductRules = [
  objectId(),
  handleValidationErrors,
];
