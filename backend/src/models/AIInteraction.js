import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * AI Interaction Schema
 * Stores all interactions with the Anthropic Claude API
 */
const aiInteractionSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false, // Optional - some interactions might not be project-specific
    index: true
  },
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
    maxlength: [10000, 'Prompt cannot exceed 10,000 characters']
  },
  
  response: {
    type: String,
    required: [true, 'Response is required'],
    maxlength: [50000, 'Response cannot exceed 50,000 characters']
  },
  
  mode: {
    type: String,
    enum: {
      values: ['explain', 'generate'],
      message: 'Mode must be either explain or generate'
    },
    required: [true, 'Mode is required']
  },
  
  model: {
    type: String,
    required: [true, 'Model is required'],
    default: 'claude-3-5-sonnet-20241022'
  },
  
  tokensUsed: {
    input: {
      type: Number,
      default: 0
    },
    output: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  
  responseTime: {
    type: Number, // Response time in milliseconds
    required: true
  },
  
  contextFiles: [{
    filename: String,
    size: Number
  }],
  
  success: {
    type: Boolean,
    default: true
  },
  
  error: {
    type: String,
    default: null
  },
  
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionId: String
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

// Indexes for performance and analytics
aiInteractionSchema.index({ userId: 1, createdAt: -1 });
aiInteractionSchema.index({ projectId: 1, createdAt: -1 });
aiInteractionSchema.index({ mode: 1, createdAt: -1 });
aiInteractionSchema.index({ success: 1, createdAt: -1 });
aiInteractionSchema.index({ createdAt: -1 }); // For general analytics

/**
 * Static method to get user interaction stats
 */
aiInteractionSchema.statics.getUserStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalInteractions: { $sum: 1 },
        totalTokensUsed: { $sum: '$tokensUsed.total' },
        avgResponseTime: { $avg: '$responseTime' },
        successRate: {
          $avg: { $cond: ['$success', 1, 0] }
        },
        modeBreakdown: {
          $push: '$mode'
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalInteractions: 0,
    totalTokensUsed: 0,
    avgResponseTime: 0,
    successRate: 0,
    modeBreakdown: []
  };
};

/**
 * Static method to get project interaction history
 */
aiInteractionSchema.statics.getProjectHistory = async function(projectId, limit = 50) {
  return this.find({ projectId })
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-response') // Exclude full response for performance
    .lean();
};

/**
 * Instance method to calculate token usage
 */
aiInteractionSchema.methods.calculateTokens = function(inputTokens, outputTokens) {
  this.tokensUsed.input = inputTokens;
  this.tokensUsed.output = outputTokens;
  this.tokensUsed.total = inputTokens + outputTokens;
};

/**
 * Instance method to mark as failed
 */
aiInteractionSchema.methods.markAsFailed = function(errorMessage) {
  this.success = false;
  this.error = errorMessage;
  this.response = 'Error occurred during AI interaction';
};

const AIInteraction = mongoose.model('AIInteraction', aiInteractionSchema);

export default AIInteraction;
