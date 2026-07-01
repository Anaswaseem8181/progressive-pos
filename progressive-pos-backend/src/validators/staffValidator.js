import { body } from 'express-validator';
import { nonEmptyString, validEmail, validEnum, objectId, optionalString, handleValidationErrors } from './common.js';

const STAFF_ROLES = ['manager', 'cashier'];

export const createStaffRules = [
  nonEmptyString('name'),
  validEmail(),
  nonEmptyString('password'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validEnum('role', STAFF_ROLES),
  nonEmptyString('contactNumber'),
  handleValidationErrors,
];

export const updateStaffRules = [
  objectId(),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('A valid email is required'),
  validEnum('role', STAFF_ROLES).optional(),
  body('contactNumber').optional().trim().notEmpty().withMessage('Contact number cannot be empty'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validEnum('status', ['active', 'inactive', 'suspended']).optional(),
  handleValidationErrors,
];

export const deleteStaffRules = [
  objectId(),
  handleValidationErrors,
];
