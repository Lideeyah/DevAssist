import { User } from '../models/index.js';

/**
 * Token Limit Middleware
 * Checks if user has exceeded daily token limits before AI requests
 */

/**
 * Check if user can make AI request based on token limits
 */
export const checkTokenLimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has exceeded daily token limit
    if (user.hasExceededDailyLimit()) {
      const stats = user.getTokenUsageStats();
      return res.status(429).json({
        success: false,
        message: 'Daily token limit exceeded',
        error: {
          code: 'TOKEN_LIMIT_EXCEEDED',
          dailyLimit: stats.daily.limit,
          tokensUsed: stats.daily.used,
          resetTime: 'Midnight UTC',
          nextReset: new Date(new Date().setUTCHours(24, 0, 0, 0)).toISOString()
        }
      });
    }

    // Add user to request for use in AI service
    req.userWithTokens = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking token limits',
      error: error.message
    });
  }
};

/**
 * Estimate tokens for a request and check if it would exceed limits
 */
export const checkEstimatedTokens = (estimateTokensFn) => {
  return async (req, res, next) => {
    try {
      const user = req.userWithTokens || await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { prompt } = req.body;
      if (!prompt) {
        return next(); // Let validation handle missing prompt
      }

      // Estimate tokens for the request
      const estimatedTokens = estimateTokensFn(prompt);
      const remainingTokens = user.getRemainingDailyTokens();

      // Check if this request would exceed the limit
      if (estimatedTokens > remainingTokens) {
        const stats = user.getTokenUsageStats();
        return res.status(429).json({
          success: false,
          message: 'Request would exceed daily token limit',
          error: {
            code: 'REQUEST_WOULD_EXCEED_LIMIT',
            estimatedTokens,
            tokensRemaining: remainingTokens,
            dailyLimit: stats.daily.limit,
            suggestion: 'Try a shorter prompt or wait until tomorrow'
          }
        });
      }

      // Add estimated tokens to request for logging
      req.estimatedTokens = estimatedTokens;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error estimating token usage',
        error: error.message
      });
    }
  };
};

/**
 * Add token usage info to response headers
 */
export const addTokenUsageHeaders = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        const stats = user.getTokenUsageStats();
        
        // Add headers with token usage info
        res.setHeader('X-Token-Limit-Daily', stats.daily.limit);
        res.setHeader('X-Token-Used-Daily', stats.daily.used);
        res.setHeader('X-Token-Remaining-Daily', stats.daily.remaining);
        res.setHeader('X-Token-Reset-Time', 'Midnight UTC');
      }
    }
    next();
  } catch (error) {
    // Don't fail the request if we can't add headers
    next();
  }
};

/**
 * Role-based token limit info
 */
export const getTokenLimitsByRole = (role) => {
  const limits = {
    developer: {
      daily: 10000,
      description: 'Standard developer plan',
      features: ['Code generation', 'Code explanation', 'Basic support']
    },
    sme: {
      daily: 25000,
      description: 'Small/Medium Enterprise plan',
      features: ['Enhanced AI features', 'Priority support', 'Advanced analytics']
    },
    admin: {
      daily: 100000,
      description: 'Administrator plan',
      features: ['Unlimited features', 'User management', 'System administration']
    }
  };

  return limits[role] || limits.developer;
};

/**
 * Middleware to add token limit info to user profile responses
 */
export const addTokenLimitInfo = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // If this is a user profile response, add token limit info
    if (data && data.data && data.data.role && req.route && req.route.path === '/me') {
      const tokenLimits = getTokenLimitsByRole(data.data.role);
      data.data.tokenLimits = tokenLimits;
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};
