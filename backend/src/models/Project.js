import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * File Schema for embedded files in projects
 */
const fileSchema = new Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
    maxlength: [255, 'Filename cannot exceed 255 characters']
  },
  
  content: {
    type: String,
    required: [true, 'File content is required'],
    maxlength: [204800, 'File content cannot exceed 200KB'] // 200KB limit
  },
  
  size: {
    type: Number,
    required: true,
    max: [204800, 'File size cannot exceed 200KB']
  },
  
  mimeType: {
    type: String,
    default: 'text/plain'
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Project Schema
 */
const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [1, 'Project name cannot be empty'],
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Project description cannot exceed 500 characters'],
    default: ''
  },
  
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required'],
    index: true
  },
  
  files: {
    type: [fileSchema],
    validate: {
      validator: function(files) {
        return files.length <= 100; // Max 100 files per project
      },
      message: 'Project cannot have more than 100 files'
    },
    default: []
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'other'],
    default: 'javascript'
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ name: 1, owner: 1 });
projectSchema.index({ isPublic: 1, createdAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ language: 1 });

/**
 * Update last activity on save
 */
projectSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

/**
 * Add file to project
 */
projectSchema.methods.addFile = function(filename, content, mimeType = 'text/plain') {
  // Check if file already exists
  const existingFileIndex = this.files.findIndex(file => file.filename === filename);
  
  const fileSize = Buffer.byteLength(content, 'utf8');
  
  // Validate file size
  if (fileSize > 204800) {
    throw new Error('File size cannot exceed 200KB');
  }
  
  const fileData = {
    filename,
    content,
    size: fileSize,
    mimeType,
    lastModified: new Date()
  };
  
  if (existingFileIndex !== -1) {
    // Update existing file
    this.files[existingFileIndex] = fileData;
  } else {
    // Add new file
    if (this.files.length >= 100) {
      throw new Error('Project cannot have more than 100 files');
    }
    this.files.push(fileData);
  }
  
  return this.save();
};

/**
 * Remove file from project
 */
projectSchema.methods.removeFile = function(filename) {
  this.files = this.files.filter(file => file.filename !== filename);
  return this.save();
};

/**
 * Get file by filename
 */
projectSchema.methods.getFile = function(filename) {
  return this.files.find(file => file.filename === filename);
};

/**
 * Get project size (total size of all files)
 */
projectSchema.methods.getTotalSize = function() {
  return this.files.reduce((total, file) => total + file.size, 0);
};

/**
 * Get files for AI context (relevant files only)
 */
projectSchema.methods.getFilesForAI = function(maxTokens = 50000) {
  // Sort files by relevance (recently modified first)
  const sortedFiles = this.files
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  
  const relevantFiles = [];
  let totalTokens = 0;
  
  for (const file of sortedFiles) {
    // Rough token estimation (1 token ≈ 4 characters)
    const fileTokens = Math.ceil(file.content.length / 4);
    
    if (totalTokens + fileTokens > maxTokens) {
      break;
    }
    
    relevantFiles.push(file);
    totalTokens += fileTokens;
  }
  
  return relevantFiles;
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
