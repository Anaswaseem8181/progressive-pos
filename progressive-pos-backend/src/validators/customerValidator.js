import { body } from 'express-validator';
import { nonEmptyString, validEnum, objectId, handleValidationErrors } from './common.js';

export const createCustomerRules = [
  nonEmptyString('name'),
  nonEmptyString('phone'),
  validEnum('status', ['REGULAR', 'VIP', 'INACTIVE']),
  handleValidationErrors,
];

export const updateCustomerRules = [
  objectId(),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
  validEnum('status', ['REGULAR', 'VIP', 'INACTIVE']).optional(),
  handleValidationErrors,
];

export const deleteCustomerRules = [
  objectId(),
  handleValidationErrors,
];
