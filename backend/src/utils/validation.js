import { body, param, query } from 'express-validator';

/**
 * Validation rules for different endpoints
 */

// User registration validation
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['developer', 'admin', 'sme'])
    .withMessage('Role must be either developer, admin, or sme')
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
export const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Change password validation
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Project validation
export const validateProject = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Project description cannot exceed 500 characters'),
  
  body('language')
    .optional()
    .isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'other'])
    .withMessage('Invalid language selection'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

// File validation
export const validateFile = [
  body('filename')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Filename must be between 1 and 255 characters')
    .matches(/^[^<>:"/\\|?*\x00-\x1f]+$/)
    .withMessage('Filename contains invalid characters'),
  
  body('content')
    .isString()
    .withMessage('File content must be a string')
    .isLength({ max: 204800 })
    .withMessage('File content cannot exceed 200KB'),
  
  body('mimeType')
    .optional()
    .isString()
    .withMessage('MIME type must be a string')
];

// AI interaction validation
export const validateAIInteraction = [
  body('prompt')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Prompt must be between 1 and 10,000 characters'),
  
  body('mode')
    .isIn(['explain', 'generate'])
    .withMessage('Mode must be either explain or generate'),
  
  body('projectId')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID format')
];

// MongoDB ObjectId validation
export const validateObjectId = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`)
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'lastActivity', '-lastActivity'])
    .withMessage('Invalid sort field')
];

// Search validation
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('language')
    .optional()
    .isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'other'])
    .withMessage('Invalid language filter'),
  
  query('tags')
    .optional()
    .isString()
    .withMessage('Tags filter must be a string')
];
