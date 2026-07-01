import { body } from 'express-validator';
import { nonEmptyString, validEmail, handleValidationErrors } from './common.js';

export const registerRules = [
  nonEmptyString('name'),
  validEmail(),
  nonEmptyString('password'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  nonEmptyString('businessName'),
  nonEmptyString('contactNumber'),
  handleValidationErrors,
];

export const loginRules = [
  validEmail(),
  nonEmptyString('password'),
  handleValidationErrors,
];

export const subscribeRules = [
  body('plan')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Plan must be monthly or yearly'),
  nonEmptyString('paymentMethodId'),
  handleValidationErrors,
];

export const changePasswordRules = [
  nonEmptyString('currentPassword'),
  nonEmptyString('newPassword'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  nonEmptyString('confirmPassword'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  handleValidationErrors,
];

export const updateBusinessInfoRules = [
  nonEmptyString('businessName'),
  nonEmptyString('contactNumber'),
  body('contactNumber')
    .matches(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/)
    .withMessage('Please add a valid Pakistani phone number'),
  handleValidationErrors,
];
