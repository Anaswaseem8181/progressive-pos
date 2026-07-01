import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

export const objectId = (field = 'id') =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

export const objectIdBody = (field) =>
  body(field).isMongoId().withMessage(`Invalid ${field}`);

export const nonEmptyString = (field) =>
  body(field).trim().notEmpty().withMessage(`${field} is required`);

export const validEmail = (field = 'email') =>
  body(field)
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid email is required');

export const validEnum = (field, values) =>
  body(field)
    .isIn(values)
    .withMessage(`Must be one of: ${values.join(', ')}`);

export const optionalString = (field) =>
  body(field).optional().trim();

export const positiveNumber = (field) =>
  body(field)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`);

export const sanitizeRegex = (field) =>
  body(field).customSanitizer((value) => {
    if (typeof value === 'string') {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    return value;
  });
