import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * JWT utility functions for token generation and verification
 */
class JWTUtils {
  /**
   * Generate access token
   */
  static generateAccessToken(payload) {
    return jwt.sign(
      payload,
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN,
        issuer: 'devassist-api',
        audience: 'devassist-client'
      }
    );
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN,
        issuer: 'devassist-api',
        audience: 'devassist-client'
      }
    );
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'devassist-api',
        audience: 'devassist-client'
      });
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'devassist-api',
        audience: 'devassist-client'
      });
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(user) {
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ userId: user._id });

    return {
      accessToken,
      refreshToken,
      expiresIn: config.JWT_EXPIRES_IN
    };
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Authorization header format is invalid');
    }

    return parts[1];
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token) {
    return jwt.decode(token, { complete: true });
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}

export default JWTUtils;
