import { validationResult } from 'express-validator';
import FileService from '../services/fileService.js';

/**
 * File Controller
 * Handles all file-related HTTP requests
 */
class FileController {
  /**
   * Save (create or update) a file in a project
   * POST /api/projects/:projectId/files
   * PUT /api/projects/:projectId/files/:filename
   */
  static async saveFile(req, res) {
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

      const { projectId } = req.params;
      const fileData = req.body;

      // If filename is in params, use it (for PUT requests)
      if (req.params.filename) {
        fileData.filename = req.params.filename;
      }

      const result = await FileService.saveFile(projectId, req.user._id, fileData);

      const statusCode = result.message.includes('updated') ? 200 : 201;

      res.status(statusCode).json({
        success: true,
        message: result.message,
        data: result.file
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get a specific file from a project
   * GET /api/projects/:projectId/files/:filename
   */
  static async getFile(req, res) {
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

      const { projectId, filename } = req.params;
      const file = await FileService.getFile(projectId, filename, req.user?._id);

      res.json({
        success: true,
        data: file
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get file content
   * GET /api/projects/:projectId/files/:filename/content
   */
  static async getFileContent(req, res) {
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

      const { projectId, filename } = req.params;
      const fileContent = await FileService.getFileContent(projectId, filename, req.user?._id);

      res.json({
        success: true,
        data: fileContent
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all files in a project
   * GET /api/projects/:projectId/files
   */
  static async getProjectFiles(req, res) {
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

      const { projectId } = req.params;
      const result = await FileService.getProjectFiles(projectId, req.user?._id);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete a file from a project
   * DELETE /api/projects/:projectId/files/:filename
   */
  static async deleteFile(req, res) {
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

      const { projectId, filename } = req.params;
      const result = await FileService.deleteFile(projectId, filename, req.user._id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Rename a file in a project
   * PATCH /api/projects/:projectId/files/:filename/rename
   */
  static async renameFile(req, res) {
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

      const { projectId, filename } = req.params;
      const { newFilename } = req.body;

      if (!newFilename) {
        return res.status(400).json({
          success: false,
          message: 'New filename is required'
        });
      }

      const result = await FileService.renameFile(projectId, filename, newFilename, req.user._id);

      res.json({
        success: true,
        message: result.message,
        data: result.file
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Copy a file within a project
   * POST /api/projects/:projectId/files/:filename/copy
   */
  static async copyFile(req, res) {
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

      const { projectId, filename } = req.params;
      const { targetFilename } = req.body;

      if (!targetFilename) {
        return res.status(400).json({
          success: false,
          message: 'Target filename is required'
        });
      }

      const result = await FileService.copyFile(projectId, filename, targetFilename, req.user._id);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.file
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Search files within a project
   * GET /api/projects/:projectId/files/search
   */
  static async searchFiles(req, res) {
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

      const { projectId } = req.params;
      const { q: searchQuery } = req.query;

      if (!searchQuery) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await FileService.searchFiles(projectId, searchQuery, req.user?._id);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default FileController;
