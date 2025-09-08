import express from "express";
import AIController from "../controllers/aiController.js";
import { authenticate } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  checkTokenLimits,
  addTokenUsageHeaders,
} from "../middleware/tokenLimits.js";
import {
  validateAIInteraction,
  validateObjectId,
  validatePagination,
} from "../utils/validation.js";
import { query } from "express-validator";

const router = express.Router();

/**
 * AI Routes
 * All routes require authentication
 */

// Health check (public)
router.get("/health", AIController.healthCheck);

// Protected routes
router.use(authenticate);

// Generate AI response
router.post(
  "/generate",
  aiLimiter,
  checkTokenLimits,
  validateAIInteraction,
  AIController.generateResponse
);

// Get user interaction history
router.get(
  "/history",
  validatePagination,
  query("projectId")
    .optional()
    .isMongoId()
    .withMessage("Invalid project ID format"),
  query("mode")
    .optional()
    .isIn(["explain", "generate"])
    .withMessage("Mode must be either explain or generate"),
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),
  AIController.getUserHistory
);

// Get user AI usage statistics
router.get(
  "/stats",
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),
  AIController.getUserStats
);

// Get user token usage and limits
router.get("/token-usage", addTokenUsageHeaders, AIController.getTokenUsage);

// Check if user can make AI request
router.get("/can-request", addTokenUsageHeaders, AIController.canMakeRequest);

// Get specific interaction by ID
router.get(
  "/interactions/:id",
  validateObjectId("id"),
  AIController.getInteraction
);

// Delete interaction
router.delete(
  "/interactions/:id",
  validateObjectId("id"),
  AIController.deleteInteraction
);

// Get project interaction history
router.get(
  "/projects/:projectId/history",
  validateObjectId("projectId"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  AIController.getProjectHistory
);

export default router;
