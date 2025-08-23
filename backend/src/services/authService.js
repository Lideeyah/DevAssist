import { User } from '../models/index.js';
import JWTUtils from '../utils/jwt.js';

/**
 * Authentication Service
 * Handles user registration, login, token refresh, and logout
 */
class AuthService {
  /**
   * Register a new user
   */
  static async register(userData) {
    const { username, email, password, role = 'developer' } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email is already registered');
      }
      if (existingUser.username === username) {
        throw new Error('Username is already taken');
      }
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair(user);

    // Save refresh token
    await user.addRefreshToken(tokens.refreshToken);

    return {
      user: user.toJSON(),
      tokens
    };
  }

  /**
   * Login user
   */
  static async login(credentials) {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password +isActive');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair(user);

    // Save refresh token
    await user.addRefreshToken(tokens.refreshToken);

    return {
      user: user.toJSON(),
      tokens
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId).select('+refreshTokens +isActive');

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Check if refresh token exists in user's tokens
      const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
      
      if (!tokenExists) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Remove old refresh token and add new one
      await user.removeRefreshToken(refreshToken);
      await user.addRefreshToken(tokens.refreshToken);

      return {
        user: user.toJSON(),
        tokens
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user (remove refresh token)
   */
  static async logout(userId, refreshToken) {
    const user = await User.findById(userId).select('+refreshTokens');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Remove specific refresh token
    await user.removeRefreshToken(refreshToken);

    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices (clear all refresh tokens)
   */
  static async logoutAll(userId) {
    const user = await User.findById(userId).select('+refreshTokens');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Clear all refresh tokens
    await user.clearRefreshTokens();

    return { message: 'Logged out from all devices successfully' };
  }

  /**
   * Change password
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear all refresh tokens for security
    await user.clearRefreshTokens();

    return { message: 'Password changed successfully. Please login again.' };
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await user.save();

    // Clear all refresh tokens
    await user.clearRefreshTokens();

    return { message: 'Account deactivated successfully' };
  }

  /**
   * Reactivate user account (admin only)
   */
  static async reactivateAccount(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = true;
    await user.save();

    return { message: 'Account reactivated successfully' };
  }

  /**
   * Get user profile
   */
  static async getProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updates) {
    const allowedUpdates = ['username', 'email'];
    const filteredUpdates = {};

    // Filter allowed updates
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid updates provided');
    }

    // Check for conflicts if updating username or email
    if (filteredUpdates.username || filteredUpdates.email) {
      const conflictQuery = {
        _id: { $ne: userId },
        $or: []
      };

      if (filteredUpdates.username) {
        conflictQuery.$or.push({ username: filteredUpdates.username });
      }
      if (filteredUpdates.email) {
        conflictQuery.$or.push({ email: filteredUpdates.email });
      }

      const existingUser = await User.findOne(conflictQuery);
      if (existingUser) {
        if (existingUser.username === filteredUpdates.username) {
          throw new Error('Username is already taken');
        }
        if (existingUser.email === filteredUpdates.email) {
          throw new Error('Email is already registered');
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }
}

export default AuthService;
