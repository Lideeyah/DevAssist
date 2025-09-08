import JWTUtils from '../utils/jwt.js';
import { User } from '../models/index.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    // Verify token
    const decoded = JWTUtils.verifyAccessToken(token);

    // Find user in database
    const user = await User.findById(decoded.userId).select('+isActive');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role(s)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = JWTUtils.extractTokenFromHeader(authHeader);
    const decoded = JWTUtils.verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('+isActive');
    
    if (user && user.isActive) {
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize('admin');

/**
 * Developer or Admin middleware
 */
export const developerOrAdmin = authorize('developer', 'admin');

/**
 * SME or Admin middleware
 */
export const smeOrAdmin = authorize('sme', 'admin');

/**
 * Check if user owns resource or is admin
 */
export const ownerOrAdmin = (resourceUserIdField = 'owner') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership
    const resourceUserId = req.resource?.[resourceUserIdField] || req.params.userId;
    
    if (!resourceUserId) {
      return res.status(400).json({
        success: false,
        message: 'Resource ownership cannot be determined'
      });
    }

    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only access your own resources'
      });
    }

    next();
  };
};

/**
 * Rate limiting by user
 */
export const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (userRequests.has(userId)) {
      const requests = userRequests.get(userId).filter(time => time > windowStart);
      userRequests.set(userId, requests);
    }

    // Get current requests for user
    const currentRequests = userRequests.get(userId) || [];

    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    currentRequests.push(now);
    userRequests.set(userId, currentRequests);

    next();
  };
};
