import express from 'express';
import FileController from '../controllers/fileController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { uploadLimiter, searchLimiter } from '../middleware/rateLimiter.js';
import {
  validateFile,
  validateObjectId
} from '../utils/validation.js';
import { body } from 'express-validator';

const router = express.Router({ mergeParams: true }); // mergeParams to access projectId from parent route

/**
 * File Routes
 * All routes are prefixed with /api/projects/:projectId/files
 */

// File search (can be public if project is public)
router.get('/search',
  optionalAuth,
  searchLimiter,
  FileController.searchFiles
);

// Get all files in project (can be public if project is public)
router.get('/',
  optionalAuth,
  validateObjectId('projectId'),
  FileController.getProjectFiles
);

// Protected routes (require authentication for modifications)
router.use(authenticate);

// Create new file
router.post('/',
  uploadLimiter,
  validateObjectId('projectId'),
  validateFile,
  FileController.saveFile
);

// Get specific file (can be public if project is public, but we'll check in controller)
router.get('/:filename',
  validateObjectId('projectId'),
  FileController.getFile
);

// Get file content
router.get('/:filename/content',
  validateObjectId('projectId'),
  FileController.getFileContent
);

// Update existing file
router.put('/:filename',
  uploadLimiter,
  validateObjectId('projectId'),
  validateFile,
  FileController.saveFile
);

// Delete file
router.delete('/:filename',
  validateObjectId('projectId'),
  FileController.deleteFile
);

// Rename file
router.patch('/:filename/rename',
  uploadLimiter,
  validateObjectId('projectId'),
  body('newFilename')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('New filename must be between 1 and 255 characters')
    .matches(/^[^<>:"/\\|?*\x00-\x1f]+$/)
    .withMessage('New filename contains invalid characters'),
  FileController.renameFile
);

// Copy file
router.post('/:filename/copy',
  uploadLimiter,
  validateObjectId('projectId'),
  body('targetFilename')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Target filename must be between 1 and 255 characters')
    .matches(/^[^<>:"/\\|?*\x00-\x1f]+$/)
    .withMessage('Target filename contains invalid characters'),
  FileController.copyFile
);

export default router;
