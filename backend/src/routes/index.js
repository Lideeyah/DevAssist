import express from 'express';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import fileRoutes from './files.js';
import aiRoutes from './ai.js';

const router = express.Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevAssist API is running',
    data: {
      service: 'DevAssist Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// API version info
router.get('/version', (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      apiVersion: 'v1',
      features: [
        'User Authentication & Authorization',
        'Project Management',
        'File Management',
        'AI Code Generation & Explanation',
        'Real-time Collaboration (Basic)'
      ],
      supportedLanguages: [
        'javascript',
        'typescript',
        'python',
        'java',
        'cpp',
        'html',
        'css'
      ]
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/files', fileRoutes);
router.use('/ai', aiRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'DevAssist API Documentation',
    data: {
      baseUrl: `${req.protocol}://${req.get('host')}/api`,
      endpoints: {
        auth: {
          'POST /auth/register': 'Register a new user',
          'POST /auth/login': 'Login user',
          'POST /auth/refresh': 'Refresh access token',
          'GET /auth/me': 'Get current user profile',
          'PUT /auth/me': 'Update user profile',
          'PUT /auth/change-password': 'Change password',
          'POST /auth/logout': 'Logout user',
          'POST /auth/logout-all': 'Logout from all devices',
          'DELETE /auth/me': 'Deactivate account'
        },
        projects: {
          'GET /projects': 'Get user projects',
          'POST /projects': 'Create new project',
          'GET /projects/public': 'Get public projects',
          'GET /projects/stats': 'Get user project statistics',
          'GET /projects/search': 'Search projects',
          'GET /projects/:id': 'Get project by ID',
          'PUT /projects/:id': 'Update project',
          'DELETE /projects/:id': 'Delete project'
        },
        files: {
          'GET /projects/:projectId/files': 'Get all files in project',
          'POST /projects/:projectId/files': 'Create new file',
          'GET /projects/:projectId/files/:filename': 'Get file metadata',
          'GET /projects/:projectId/files/:filename/content': 'Get file content',
          'PUT /projects/:projectId/files/:filename': 'Update file',
          'DELETE /projects/:projectId/files/:filename': 'Delete file',
          'PATCH /projects/:projectId/files/:filename/rename': 'Rename file',
          'POST /projects/:projectId/files/:filename/copy': 'Copy file',
          'GET /projects/:projectId/files/search': 'Search files in project'
        },
        ai: {
          'GET /ai/health': 'AI service health check',
          'POST /ai/generate': 'Generate AI response',
          'GET /ai/history': 'Get user interaction history',
          'GET /ai/stats': 'Get user AI usage statistics',
          'GET /ai/interactions/:id': 'Get specific interaction',
          'DELETE /ai/interactions/:id': 'Delete interaction',
          'GET /ai/projects/:projectId/history': 'Get project interaction history'
        }
      },
      authentication: {
        type: 'Bearer Token (JWT)',
        header: 'Authorization: Bearer <token>',
        refreshEndpoint: '/api/auth/refresh'
      },
      rateLimit: {
        general: '100 requests per 15 minutes',
        auth: '10 requests per 15 minutes',
        ai: '100 requests per hour (varies by role)',
        upload: '50 requests per 10 minutes',
        project: '20 requests per hour'
      },
      fileConstraints: {
        maxFileSize: '200KB',
        maxFilesPerProject: 100,
        supportedMimeTypes: 'text/plain, application/json, text/javascript, etc.'
      }
    }
  });
});

export default router;
