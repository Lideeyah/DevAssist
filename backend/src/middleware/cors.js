import cors from "cors";

/**
 * CORS Configuration - Allow all origins
 */
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Access-Token",
  ],
  exposedHeaders: ["Content-Length", "X-Kuma-Revision", "Date"],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

/**
 * CORS Middleware
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Custom CORS Handler for specific routes - Now allows all origins
 */
export const customCors = () => {
  return cors({
    ...corsOptions,
    origin: "*", // Allow all origins
  });
};

/**
 * Preflight Handler - Allow all origins
 */
export const handlePreflight = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(",")
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }
  next();
};

/**
 * Security-focused CORS for sensitive endpoints - Now allows all origins
 */
export const strictCors = cors({
  origin: "*", // Allow all origins
  credentials: true,
  methods: ["POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

/**
 * Public CORS for public endpoints
 */
export const publicCors = cors({
  origin: "*",
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: false,
});
