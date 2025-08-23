import { validationResult } from 'express-validator';
import ProjectService from '../services/projectService.js';

/**
 * Project Controller
 * Handles all project-related HTTP requests
 */
class ProjectController {
  /**
   * Create a new project
   * POST /api/projects
   */
  static async createProject(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const project = await ProjectService.createProject(req.user._id, req.body);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user's projects
   * GET /api/projects
   */
  static async getUserProjects(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || '-createdAt',
        search: req.query.q,
        language: req.query.language,
        tags: req.query.tags
      };

      const result = await ProjectService.getUserProjects(req.user._id, options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get public projects
   * GET /api/projects/public
   */
  static async getPublicProjects(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || '-createdAt',
        search: req.query.q,
        language: req.query.language,
        tags: req.query.tags
      };

      const result = await ProjectService.getPublicProjects(options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get project by ID
   * GET /api/projects/:id
   */
  static async getProjectById(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const project = await ProjectService.getProjectById(req.params.id, req.user?._id);

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update project
   * PUT /api/projects/:id
   */
  static async updateProject(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const project = await ProjectService.updateProject(req.params.id, req.user._id, req.body);

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete project
   * DELETE /api/projects/:id
   */
  static async deleteProject(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const result = await ProjectService.deleteProject(req.params.id, req.user._id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user project statistics
   * GET /api/projects/stats
   */
  static async getUserProjectStats(req, res) {
    try {
      const stats = await ProjectService.getUserProjectStats(req.user._id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Search projects
   * GET /api/projects/search
   */
  static async searchProjects(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { q: searchQuery } = req.query;

      if (!searchQuery) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || '-createdAt',
        language: req.query.language,
        tags: req.query.tags
      };

      const result = await ProjectService.searchProjects(req.user._id, searchQuery, options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default ProjectController;
