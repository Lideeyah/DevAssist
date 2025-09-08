import { Project } from '../models/index.js';
import mongoose from 'mongoose';

/**
 * File Service
 * Handles all file-related operations within projects
 */
class FileService {
  /**
   * Add or update a file in a project
   */
  static async saveFile(projectId, userId, fileData) {
    const { filename, content, mimeType = 'text/plain' } = fileData;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Validate file size
    const fileSize = Buffer.byteLength(content, 'utf8');
    if (fileSize > 204800) { // 200KB
      throw new Error('File size cannot exceed 200KB');
    }

    // Check if adding new file would exceed limit
    const existingFileIndex = project.files.findIndex(file => file.filename === filename);
    if (existingFileIndex === -1 && project.files.length >= 100) {
      throw new Error('Project cannot have more than 100 files');
    }

    try {
      await project.addFile(filename, content, mimeType);
      
      // Return the updated file
      const updatedProject = await Project.findById(projectId);
      const file = updatedProject.getFile(filename);
      
      return {
        message: existingFileIndex !== -1 ? 'File updated successfully' : 'File created successfully',
        file
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to save file');
    }
  }

  /**
   * Get a specific file from a project
   */
  static async getFile(projectId, filename, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findById(projectId).populate('owner', 'username email');

    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    const isOwner = userId && project.owner._id.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error('Access denied');
    }

    const file = project.getFile(filename);

    if (!file) {
      throw new Error('File not found');
    }

    return file;
  }

  /**
   * Get all files in a project
   */
  static async getProjectFiles(projectId, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findById(projectId)
      .populate('owner', 'username email')
      .select('files owner isPublic name');

    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    const isOwner = userId && project.owner._id.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error('Access denied');
    }

    // Return files without content for performance (just metadata)
    const filesMetadata = project.files.map(file => ({
      _id: file._id,
      filename: file.filename,
      size: file.size,
      mimeType: file.mimeType,
      lastModified: file.lastModified,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    }));

    return {
      projectId: project._id,
      projectName: project.name,
      owner: project.owner,
      files: filesMetadata,
      totalFiles: project.files.length,
      totalSize: project.getTotalSize()
    };
  }

  /**
   * Delete a file from a project
   */
  static async deleteFile(projectId, filename, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Check if file exists
    const file = project.getFile(filename);
    if (!file) {
      throw new Error('File not found');
    }

    try {
      await project.removeFile(filename);
      
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Rename a file in a project
   */
  static async renameFile(projectId, oldFilename, newFilename, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Check if old file exists
    const file = project.getFile(oldFilename);
    if (!file) {
      throw new Error('File not found');
    }

    // Check if new filename already exists
    const existingFile = project.getFile(newFilename);
    if (existingFile) {
      throw new Error('A file with the new name already exists');
    }

    try {
      // Add file with new name
      await project.addFile(newFilename, file.content, file.mimeType);
      
      // Remove old file
      await project.removeFile(oldFilename);
      
      // Get the renamed file
      const updatedProject = await Project.findById(projectId);
      const renamedFile = updatedProject.getFile(newFilename);
      
      return {
        message: 'File renamed successfully',
        file: renamedFile
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to rename file');
    }
  }

  /**
   * Copy a file within a project
   */
  static async copyFile(projectId, sourceFilename, targetFilename, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: userId
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Check if source file exists
    const sourceFile = project.getFile(sourceFilename);
    if (!sourceFile) {
      throw new Error('Source file not found');
    }

    // Check if target filename already exists
    const existingFile = project.getFile(targetFilename);
    if (existingFile) {
      throw new Error('A file with the target name already exists');
    }

    // Check file limit
    if (project.files.length >= 100) {
      throw new Error('Project cannot have more than 100 files');
    }

    try {
      // Add copied file
      await project.addFile(targetFilename, sourceFile.content, sourceFile.mimeType);
      
      // Get the copied file
      const updatedProject = await Project.findById(projectId);
      const copiedFile = updatedProject.getFile(targetFilename);
      
      return {
        message: 'File copied successfully',
        file: copiedFile
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to copy file');
    }
  }

  /**
   * Get file content with proper encoding
   */
  static async getFileContent(projectId, filename, userId = null) {
    const file = await this.getFile(projectId, filename, userId);
    
    return {
      filename: file.filename,
      content: file.content,
      mimeType: file.mimeType,
      size: file.size,
      lastModified: file.lastModified
    };
  }

  /**
   * Search files within a project
   */
  static async searchFiles(projectId, searchQuery, userId = null) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findById(projectId).populate('owner', 'username email');

    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    const isOwner = userId && project.owner._id.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error('Access denied');
    }

    // Search in filenames and content
    const matchingFiles = project.files.filter(file => {
      const filenameMatch = file.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = file.content.toLowerCase().includes(searchQuery.toLowerCase());
      return filenameMatch || contentMatch;
    });

    return {
      projectId: project._id,
      projectName: project.name,
      searchQuery,
      results: matchingFiles.map(file => ({
        _id: file._id,
        filename: file.filename,
        size: file.size,
        mimeType: file.mimeType,
        lastModified: file.lastModified,
        // Include snippet of matching content
        snippet: this.getContentSnippet(file.content, searchQuery)
      })),
      totalMatches: matchingFiles.length
    };
  }

  /**
   * Get a snippet of content around the search term
   */
  static getContentSnippet(content, searchQuery, snippetLength = 200) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    
    if (index === -1) {
      return content.substring(0, snippetLength) + (content.length > snippetLength ? '...' : '');
    }
    
    const start = Math.max(0, index - snippetLength / 2);
    const end = Math.min(content.length, start + snippetLength);
    
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  }
}

export default FileService;
