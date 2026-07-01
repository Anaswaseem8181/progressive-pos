import { body } from 'express-validator';
import { nonEmptyString, optionalString, objectId, handleValidationErrors } from './common.js';

export const createCategoryRules = [
  nonEmptyString('name'),
  optionalString('description'),
  handleValidationErrors,
];

export const updateCategoryRules = [
  objectId(),
  optionalString('name'),
  optionalString('description'),
  handleValidationErrors,
];

export const archiveCategoryRules = [
  objectId(),
  handleValidationErrors,
];
