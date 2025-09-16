// backend/src/routes/files.js
import express from "express";
import { body } from "express-validator";
import FileController from "../controllers/fileController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { uploadLimiter, searchLimiter } from "../middleware/rateLimiter.js";
import { validateFile, validateObjectId } from "../utils/validation.js";

const router = express.Router({ mergeParams: true }); // need projectId

/**
 * File Routes
 * Base path: /api/projects/:projectId/files
 */

// Public / semi-public (optional auth)
router.get(
  "/search",
  optionalAuth,
  searchLimiter,
  FileController.searchFiles
);

router.get(
  "/",
  optionalAuth,
  validateObjectId("projectId"),
  FileController.getProjectFiles
);

// Auth required for file modifications
router.use(authenticate);

// Create file
router.post(
  "/",
  uploadLimiter,
  validateObjectId("projectId"),
  validateFile,
  FileController.saveFile
);

// Get metadata
router.get(
  "/:filename",
  validateObjectId("projectId"),
  FileController.getFile
);

// Get content
router.get(
  "/:filename/content",
  validateObjectId("projectId"),
  FileController.getFileContent
);

// Update file (overwrite)
router.put(
  "/:filename",
  uploadLimiter,
  validateObjectId("projectId"),
  validateFile,
  FileController.saveFile
);

// Delete file
router.delete(
  "/:filename",
  validateObjectId("projectId"),
  FileController.deleteFile
);

// Rename
router.patch(
  "/:filename/rename",
  uploadLimiter,
  validateObjectId("projectId"),
  body("newFilename")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Filename must be 1–255 chars")
    .matches(/^[^<>:"/\\|?*\x00-\x1f]+$/)
    .withMessage("Filename contains invalid characters"),
  FileController.renameFile
);

// Copy
router.post(
  "/:filename/copy",
  uploadLimiter,
  validateObjectId("projectId"),
  body("targetFilename")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Target filename must be 1–255 chars")
    .matches(/^[^<>:"/\\|?*\x00-\x1f]+$/)
    .withMessage("Target filename contains invalid characters"),
  FileController.copyFile
);

export default router;
