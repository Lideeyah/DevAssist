// backend/src/routes/projects.js
import express from "express";
import ProjectController from "../controllers/projectController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { projectLimiter, searchLimiter } from "../middleware/rateLimiter.js";
import {
  validateProject,
  validateObjectId,
  validatePagination,
  validateSearch,
} from "../utils/validation.js";

const router = express.Router();

/**
 * Project Routes
 * Base path: /api/projects
 */

// Public projects
router.get(
  "/public",
  optionalAuth,
  validatePagination,
  validateSearch,
  ProjectController.getPublicProjects
);

// Auth required
router.use(authenticate);

// CRUD
router.post("/", projectLimiter, validateProject, ProjectController.createProject);

router.get("/", validatePagination, validateSearch, ProjectController.getUserProjects);

router.get("/stats", ProjectController.getUserProjectStats);

router.get(
  "/search",
  searchLimiter,
  validateSearch,
  ProjectController.searchProjects
);

router.get("/:id", validateObjectId("id"), ProjectController.getProjectById);

router.put(
  "/:id",
  validateObjectId("id"),
  validateProject,
  ProjectController.updateProject
);

router.delete("/:id", validateObjectId("id"), ProjectController.deleteProject);

export default router;
