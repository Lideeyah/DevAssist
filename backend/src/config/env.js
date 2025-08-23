import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Environment configuration with validation
 */
const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Hugging Face
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  HUGGINGFACE_MODEL: process.env.HUGGINGFACE_MODEL || "gpt2",
  HUGGINGFACE_MAX_TOKENS: parseInt(process.env.HUGGINGFACE_MAX_TOKENS) || 1024,

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 204800, // 200KB
  MAX_FILES_PER_PROJECT: parseInt(process.env.MAX_FILES_PER_PROJECT) || 100,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
  const required = [
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "HUGGINGFACE_API_KEY",
  ];

  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missing.join(", ")
    );
    console.error(
      "Please check your .env file and ensure all required variables are set."
    );
    process.exit(1);
  }
};

// Validate configuration on import
validateConfig();

export default config;
