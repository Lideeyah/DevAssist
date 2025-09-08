import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

/**
 * Rate Limiting Middleware
 */

/**
 * General API Rate Limiter
 */
export const generalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: config.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user ? `user:${req.user._id}` : `ip:${req.ip}`;
  },
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

/**
 * Strict Rate Limiter for Authentication Routes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP for auth routes since user might not be authenticated yet
    return `auth:${req.ip}`;
  }
});

/**
 * AI Generation Rate Limiter
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    // Different limits based on user role
    if (req.user) {
      switch (req.user.role) {
        case 'admin':
          return 1000; // Admin gets higher limit
        case 'sme':
          return 200; // SME gets moderate limit
        case 'developer':
        default:
          return 100; // Developer gets standard limit
      }
    }
    return 10; // Unauthenticated users get very low limit
  },
  message: {
    success: false,
    message: 'AI generation rate limit exceeded. Please upgrade your plan or try again later.',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `ai:${req.user._id}` : `ai:${req.ip}`;
  }
});

/**
 * File Upload Rate Limiter
 */
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 file operations per window
  message: {
    success: false,
    message: 'Too many file operations, please try again later.',
    retryAfter: 600 // 10 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `upload:${req.user._id}` : `upload:${req.ip}`;
  }
});

/**
 * Project Creation Rate Limiter
 */
export const projectLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 projects per hour
  message: {
    success: false,
    message: 'Project creation rate limit exceeded. Please try again later.',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `project:${req.user._id}` : `project:${req.ip}`;
  }
});

/**
 * Password Reset Rate Limiter
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `password-reset:${req.ip}`;
  }
});

/**
 * Search Rate Limiter
 */
export const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 searches per 5 minutes
  message: {
    success: false,
    message: 'Search rate limit exceeded, please try again later.',
    retryAfter: 300 // 5 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `search:${req.user._id}` : `search:${req.ip}`;
  }
});

/**
 * Dynamic Rate Limiter Factory
 */
export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      success: false,
      message: 'Rate limit exceeded, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Rate Limit Info Middleware
 * Adds rate limit information to response headers
 */
export const rateLimitInfo = (req, res, next) => {
  // Add custom rate limit headers if needed
  res.setHeader('X-API-Version', '1.0');
  next();
};
