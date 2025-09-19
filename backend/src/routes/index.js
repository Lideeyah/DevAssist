// backend/src/routes/index.js
import express from "express";
import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import fileRoutes from "./files.js";
import aiRoutes from "./ai.js";

const router = express.Router();

/**
 * API Routes
 * Base prefix: /api
 */

// Health
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "DevAssist API is healthy",
    service: "DevAssist Backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Version info
router.get("/version", (req, res) => {
  res.json({
    success: true,
    version: "1.0.0",
    apiVersion: "v1",
    features: [
      "Authentication",
      "Project Management",
      "File Management",
      "AI Code Support",
    ],
    supportedLanguages: [
      "javascript",
      "typescript",
      "python",
      "java",
      "cpp",
      "html",
      "css",
    ],
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/projects/:projectId/files", fileRoutes);
router.use("/ai", aiRoutes);

// Docs (basic JSON doc endpoint)
router.get("/docs", (req, res) => {
  res.json({
    success: true,
    baseUrl: `${req.protocol}://${req.get("host")}/api`,
    routes: {
      auth: ["/register", "/login", "/refresh", "/me", "/logout"],
      projects: ["/", "/public", "/stats", "/search", "/:id"],
      files: [
        "/projects/:projectId/files",
        "/projects/:projectId/files/:filename",
      ],
      ai: [
        "/chat",
        "/stt",
        "/autodoc",
        "/sme/generate",
        "/sme/speech-generate",
        "/health",
      ],
    },
  });
});

export default router;
