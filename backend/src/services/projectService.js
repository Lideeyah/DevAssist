import { Project } from '../models/index.js';
import mongoose from 'mongoose';

/**
 * Project Service
 * Handles all project-related business logic
 */
class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(userId, projectData) {
    const { name, description, language, tags, isPublic } = projectData;

    const project = new Project({
      name,
      description,
      owner: userId,
      language,
      tags,
      isPublic: isPublic || false
    });

    await project.save();
    await project.populate('owner', 'username email');

    return project;
  }

  /**
   * Get projects for a user with pagination and filtering
   */
  static async getUserProjects(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      language,
      tags
    } = options;

    const skip = (page - 1) * limit;
    const query = { owner: userId };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add language filter
    if (language) {
      query.language = language;
    }

    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('owner', 'username email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query)
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get public projects with pagination and filtering
   */
  static async getPublicProjects(options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      language,
      tags
    } = options;

    const skip = (page - 1) * limit;
    const query = { isPublic: true };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add language filter
    if (language) {
      query.language = language;
    }

    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('owner', 'username email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query)
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get project by ID
   */
  static async getProjectById(projectId, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findById(projectId)
      .populate('owner', 'username email')
      .lean();

    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    const isOwner = userId && project.owner._id.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error('Access denied');
    }

    return project;
  }

  /**
   * Update project
   */
  static async updateProject(projectId, userId, updates) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const allowedUpdates = ['name', 'description', 'language', 'tags', 'isPublic'];
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

    const project = await Project.findOneAndUpdate(
      { _id: projectId, owner: userId },
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('owner', 'username email');

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return project;
  }

  /**
   * Delete project
   */
  static async deleteProject(projectId, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findOneAndDelete({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return { message: 'Project deleted successfully' };
  }

  /**
   * Get project statistics for a user
   */
  static async getUserProjectStats(userId) {
    const stats = await Project.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          publicProjects: {
            $sum: { $cond: ['$isPublic', 1, 0] }
          },
          privateProjects: {
            $sum: { $cond: ['$isPublic', 0, 1] }
          },
          totalFiles: {
            $sum: { $size: '$files' }
          },
          languageBreakdown: {
            $push: '$language'
          },
          avgFilesPerProject: {
            $avg: { $size: '$files' }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalProjects: 0,
      publicProjects: 0,
      privateProjects: 0,
      totalFiles: 0,
      languageBreakdown: [],
      avgFilesPerProject: 0
    };

    // Process language breakdown
    const languageCounts = {};
    result.languageBreakdown.forEach(lang => {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    result.languageBreakdown = languageCounts;

    return result;
  }

  /**
   * Search projects across all public projects and user's projects
   */
  static async searchProjects(userId, searchQuery, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      language,
      tags
    } = options;

    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { owner: userId }, // User's own projects
        { isPublic: true } // Public projects
      ],
      $and: [
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { tags: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      ]
    };

    // Add language filter
    if (language) {
      query.language = language;
    }

    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('owner', 'username email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query)
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export default ProjectService;
