/**
 * Application Constants
 */

// User Roles
export const USER_ROLES = {
  DEVELOPER: "developer",
  ADMIN: "admin",
  SME: "sme",
};

// Project Languages
export const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: "javascript",
  TYPESCRIPT: "typescript",
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
  HTML: "html",
  CSS: "css",
  OTHER: "other",
};

// AI Modes
export const AI_MODES = {
  EXPLAIN: "explain",
  GENERATE: "generate",
};

// File Constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 204800, // 200KB in bytes
  MAX_FILES_PER_PROJECT: 100,
  ALLOWED_EXTENSIONS: [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".json",
    ".xml",
    ".yaml",
    ".yml",
    ".md",
    ".txt",
    ".sql",
    ".sh",
    ".php",
    ".rb",
    ".go",
    ".rs",
  ],
};

// Rate Limits
export const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 10,
  },
  AI: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: {
      [USER_ROLES.DEVELOPER]: 100,
      [USER_ROLES.SME]: 200,
      [USER_ROLES.ADMIN]: 1000,
    },
  },
  UPLOAD: {
    WINDOW_MS: 10 * 60 * 1000, // 10 minutes
    MAX_REQUESTS: 50,
  },
  PROJECT: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 20,
  },
};

// Token Limits (Daily)
export const TOKEN_LIMITS_DAILY = {
  [USER_ROLES.DEVELOPER]: 10000, // 10K tokens per day
  [USER_ROLES.SME]: 25000, // 25K tokens per day
  [USER_ROLES.ADMIN]: 100000, // 100K tokens per day
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  ACCESS_DENIED: "Access denied",
  ACCOUNT_DEACTIVATED: "Account is deactivated",

  // Validation
  VALIDATION_FAILED: "Validation failed",
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please provide a valid email address",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and number",

  // Resources
  USER_NOT_FOUND: "User not found",
  PROJECT_NOT_FOUND: "Project not found",
  FILE_NOT_FOUND: "File not found",
  RESOURCE_NOT_FOUND: "Resource not found",

  // Conflicts
  EMAIL_EXISTS: "Email is already registered",
  USERNAME_EXISTS: "Username is already taken",
  FILE_EXISTS: "File already exists",

  // Limits
  FILE_TOO_LARGE: "File size cannot exceed 200KB",
  TOO_MANY_FILES: "Project cannot have more than 100 files",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",

  // AI
  AI_SERVICE_ERROR: "AI service is currently unavailable",
  INVALID_AI_MODE: "AI mode must be either explain or generate",

  // General
  INTERNAL_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  REGISTRATION_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  PROFILE_UPDATED: "Profile updated successfully",

  // Projects
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROJECT_DELETED: "Project deleted successfully",

  // Files
  FILE_CREATED: "File created successfully",
  FILE_UPDATED: "File updated successfully",
  FILE_DELETED: "File deleted successfully",
  FILE_RENAMED: "File renamed successfully",
  FILE_COPIED: "File copied successfully",

  // AI
  AI_RESPONSE_GENERATED: "AI response generated successfully",
  INTERACTION_DELETED: "Interaction deleted successfully",
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Sort Options
export const SORT_OPTIONS = {
  CREATED_AT_DESC: "-createdAt",
  CREATED_AT_ASC: "createdAt",
  NAME_ASC: "name",
  NAME_DESC: "-name",
  LAST_ACTIVITY_DESC: "-lastActivity",
  LAST_ACTIVITY_ASC: "lastActivity",
};

// MIME Types
export const MIME_TYPES = {
  JAVASCRIPT: "text/javascript",
  TYPESCRIPT: "text/typescript",
  PYTHON: "text/x-python",
  JAVA: "text/x-java-source",
  CPP: "text/x-c++src",
  HTML: "text/html",
  CSS: "text/css",
  JSON: "application/json",
  MARKDOWN: "text/markdown",
  PLAIN_TEXT: "text/plain",
};

// Hugging Face Models
export const HUGGINGFACE_MODELS = {
  QWEN_CODER: "Qwen/Qwen2.5-Coder-32B-Instruct",
  STARCODER: "bigcode/starcoder2-15b",
  DIALOGPT: "microsoft/DialoGPT-large",
  CODEBERT: "microsoft/CodeBERT-base",
  CODELLAMA: "codellama/CodeLlama-13b-Instruct-hf",
};

// Token Limits (approximate)
export const TOKEN_LIMITS = {
  [HUGGINGFACE_MODELS.QWEN_CODER]: 32768,
  [HUGGINGFACE_MODELS.STARCODER]: 8192,
  [HUGGINGFACE_MODELS.DIALOGPT]: 1024,
  [HUGGINGFACE_MODELS.CODEBERT]: 512,
  [HUGGINGFACE_MODELS.CODELLAMA]: 4096,
};

// Environment Types
export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

// Log Levels
export const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};

// Database Collections
export const COLLECTIONS = {
  USERS: "users",
  PROJECTS: "projects",
  AI_INTERACTIONS: "aiinteractions",
};

// JWT Token Types
export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
};

// API Versions
export const API_VERSION = "v1";

// Default Values
export const DEFAULTS = {
  USER_ROLE: USER_ROLES.DEVELOPER,
  PROJECT_LANGUAGE: SUPPORTED_LANGUAGES.JAVASCRIPT,
  AI_MODEL: HUGGINGFACE_MODELS.QWEN_CODER,
  MAX_TOKENS: 2048,
  FILE_MIME_TYPE: MIME_TYPES.PLAIN_TEXT,
  PROJECT_VISIBILITY: false, // private by default
};
