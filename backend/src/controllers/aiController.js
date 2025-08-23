import { validationResult } from "express-validator";
import aiService from "../services/aiService.js";
import { User } from "../models/index.js";

/**
 * AI Controller
 * Handles all AI-related HTTP requests
 */
class AIController {
  /**
   * Generate AI response
   * POST /api/ai/generate
   */
  static async generateResponse(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { projectId, prompt, mode } = req.body;

      // Prepare metadata
      const metadata = {
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        sessionId: req.sessionID,
      };

      const result = await aiService.generateResponse(
        req.user._id,
        { projectId, prompt, mode },
        metadata
      );

      res.json({
        success: true,
        message: "AI response generated successfully",
        data: result,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Access denied")
        ? 403
        : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get user interaction history
   * GET /api/ai/history
   */
  static async getUserHistory(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        projectId: req.query.projectId,
        mode: req.query.mode,
        days: parseInt(req.query.days) || 30,
      };

      const result = await aiService.getUserInteractionHistory(
        req.user._id,
        options
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get specific interaction by ID
   * GET /api/ai/interactions/:id
   */
  static async getInteraction(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const interaction = await aiService.getInteractionById(id, req.user._id);

      res.json({
        success: true,
        data: interaction,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get user AI usage statistics
   * GET /api/ai/stats
   */
  static async getUserStats(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const stats = await aiService.getUserStats(req.user._id, days);

      res.json({
        success: true,
        data: {
          ...stats,
          period: `${days} days`,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get project interaction history
   * GET /api/ai/projects/:projectId/history
   */
  static async getProjectHistory(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { projectId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      const history = await aiService.getProjectInteractionHistory(
        projectId,
        req.user._id,
        limit
      );

      res.json({
        success: true,
        data: {
          projectId,
          interactions: history,
          total: history.length,
        },
      });
    } catch (error) {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Access denied")
        ? 403
        : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete interaction
   * DELETE /api/ai/interactions/:id
   */
  static async deleteInteraction(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const result = await aiService.deleteInteraction(id, req.user._id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const statusCode = error.message.includes("not found") ? 404 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get user token usage and limits
   * GET /api/ai/token-usage
   */
  static async getTokenUsage(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const stats = user.getTokenUsageStats();

      res.json({
        success: true,
        data: {
          role: user.role,
          ...stats,
          resetTime: {
            daily: "Midnight UTC",
            nextReset: new Date(
              new Date().setUTCHours(24, 0, 0, 0)
            ).toISOString(),
          },
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Check if user can make AI request
   * GET /api/ai/can-request
   */
  static async canMakeRequest(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const hasExceeded = user.hasExceededDailyLimit();
      const remaining = user.getRemainingDailyTokens();
      const limit = user.getDailyTokenLimit();

      res.json({
        success: true,
        data: {
          canMakeRequest: !hasExceeded,
          dailyLimit: limit,
          tokensUsed: limit - remaining,
          tokensRemaining: remaining,
          limitExceeded: hasExceeded,
          message: hasExceeded
            ? "Daily token limit exceeded. Limit resets at midnight UTC."
            : `You have ${remaining} tokens remaining today.`,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Health check for AI service
   * GET /api/ai/health
   */
  static async healthCheck(req, res) {
    try {
      // Simple health check - could be expanded to test API connectivity
      res.json({
        success: true,
        message: "AI service is healthy",
        data: {
          model:
            process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-Coder-32B-Instruct",
          maxTokens: process.env.HUGGINGFACE_MAX_TOKENS || 2048,
          provider: "Hugging Face",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "AI service health check failed",
        error: error.message,
      });
    }
  }
}

export default AIController;
