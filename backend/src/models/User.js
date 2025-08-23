import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

/**
 * User Schema
 * Supports three roles: developer, admin, sme
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      // unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ["developer", "admin", "sme"],
        message: "Role must be either developer, admin, or sme",
      },
      default: "developer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // 7 days in seconds
        },
      },
    ],

    // Token usage tracking
    tokenUsage: {
      daily: {
        date: {
          type: String,
          default: () => new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        },
        tokensUsed: {
          type: Number,
          default: 0,
        },
        requestCount: {
          type: Number,
          default: 0,
        },
      },
      monthly: {
        month: {
          type: String,
          default: () => new Date().toISOString().substring(0, 7), // YYYY-MM format
        },
        tokensUsed: {
          type: Number,
          default: 0,
        },
        requestCount: {
          type: Number,
          default: 0,
        },
      },
      totalTokensUsed: {
        type: Number,
        default: 0,
      },
      totalRequests: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "tokenUsage.daily.date": 1 });
userSchema.index({ "tokenUsage.monthly.month": 1 });

/**
 * Token usage management methods
 */

// Get daily token limit based on user role
userSchema.methods.getDailyTokenLimit = function () {
  const limits = {
    developer: 10000,
    sme: 25000,
    admin: 100000,
  };
  return limits[this.role] || limits.developer;
};

// Check if user has exceeded daily token limit
userSchema.methods.hasExceededDailyLimit = function () {
  const today = new Date().toISOString().split("T")[0];

  // Reset if it's a new day
  if (this.tokenUsage.daily.date !== today) {
    return false; // New day, no limit exceeded
  }

  return this.tokenUsage.daily.tokensUsed >= this.getDailyTokenLimit();
};

// Get remaining daily tokens
userSchema.methods.getRemainingDailyTokens = function () {
  const today = new Date().toISOString().split("T")[0];

  // Reset if it's a new day
  if (this.tokenUsage.daily.date !== today) {
    return this.getDailyTokenLimit();
  }

  const remaining =
    this.getDailyTokenLimit() - this.tokenUsage.daily.tokensUsed;
  return Math.max(0, remaining);
};

// Update token usage
userSchema.methods.updateTokenUsage = async function (tokensUsed) {
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().substring(0, 7);

  // Reset daily usage if it's a new day
  if (this.tokenUsage.daily.date !== today) {
    this.tokenUsage.daily.date = today;
    this.tokenUsage.daily.tokensUsed = 0;
    this.tokenUsage.daily.requestCount = 0;
  }

  // Reset monthly usage if it's a new month
  if (this.tokenUsage.monthly.month !== currentMonth) {
    this.tokenUsage.monthly.month = currentMonth;
    this.tokenUsage.monthly.tokensUsed = 0;
    this.tokenUsage.monthly.requestCount = 0;
  }

  // Update usage
  this.tokenUsage.daily.tokensUsed += tokensUsed;
  this.tokenUsage.daily.requestCount += 1;
  this.tokenUsage.monthly.tokensUsed += tokensUsed;
  this.tokenUsage.monthly.requestCount += 1;
  this.tokenUsage.totalTokensUsed += tokensUsed;
  this.tokenUsage.totalRequests += 1;

  await this.save();
};

// Get token usage statistics
userSchema.methods.getTokenUsageStats = function () {
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().substring(0, 7);

  return {
    daily: {
      limit: this.getDailyTokenLimit(),
      used:
        this.tokenUsage.daily.date === today
          ? this.tokenUsage.daily.tokensUsed
          : 0,
      remaining: this.getRemainingDailyTokens(),
      requests:
        this.tokenUsage.daily.date === today
          ? this.tokenUsage.daily.requestCount
          : 0,
    },
    monthly: {
      used:
        this.tokenUsage.monthly.month === currentMonth
          ? this.tokenUsage.monthly.tokensUsed
          : 0,
      requests:
        this.tokenUsage.monthly.month === currentMonth
          ? this.tokenUsage.monthly.requestCount
          : 0,
    },
    total: {
      tokensUsed: this.tokenUsage.totalTokensUsed,
      requests: this.tokenUsage.totalRequests,
    },
  };
};

/**
 * Hash password before saving
 */
userSchema.pre("save", async function (next) {
  // Only hash password if it's been modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password method
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Add refresh token
 */
userSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token });
  return this.save();
};

/**
 * Remove refresh token
 */
userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
  return this.save();
};

/**
 * Clear all refresh tokens
 */
userSchema.methods.clearRefreshTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

/**
 * Update last login
 */
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
