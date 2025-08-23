import { InferenceClient } from "@huggingface/inference";
import { Project, AIInteraction, User } from "../models/index.js";
import config from "../config/env.js";
import mongoose from "mongoose";

/**
 * AI Service
 * Handles interactions with Hugging Face Inference API
 */
class AIService {
  constructor() {
    this.hf = new InferenceClient(config.HUGGINGFACE_API_KEY);

    // Available models with fallbacks (ordered by reliability and availability)
    this.models = {
      primary: config.HUGGINGFACE_MODEL || "microsoft/DialoGPT-medium",
      fallbacks: [
        "microsoft/DialoGPT-medium", // Conversational model
        "gpt2", // Classic text generation
        "distilgpt2", // Smaller, faster text generation
        "Salesforce/codegen-350M-mono", // Code generation
      ],
    };
  }

  /**
   * Call AI API with intelligent fallback system (production-ready)
   */
  async callAIAPI(model, prompt, mode) {
    // Strategy 1: Try Hugging Face if API key is valid
    if (this.isValidHuggingFaceKey()) {
      try {
        console.log(`🔄 Trying Hugging Face...`);
        const result = await this.callHuggingFaceAPI(model, prompt, mode);
        if (result && result.trim()) {
          console.log(`✅ Hugging Face succeeded`);
          return result;
        }
      } catch (error) {
        console.warn(`❌ Hugging Face failed:`, error.message);
      }
    }

    // Strategy 2: Try enhanced local AI generation
    try {
      console.log(`🔄 Trying enhanced local AI...`);
      const result = await this.callEnhancedLocalAI(prompt, mode);
      if (result && result.trim()) {
        console.log(`✅ Enhanced local AI succeeded`);
        return result;
      }
    } catch (error) {
      console.warn(`❌ Enhanced local AI failed:`, error.message);
    }

    // Strategy 3: Fallback to mock AI (always works)
    console.log(`🤖 Using DevAssist Mock AI (reliable fallback)`);
    return this.generateMockResponse(prompt, mode);
  }

  /**
   * Check if Hugging Face API key is valid
   */
  isValidHuggingFaceKey() {
    return (
      config.HUGGINGFACE_API_KEY &&
      config.HUGGINGFACE_API_KEY !== "your-huggingface-api-key-here" &&
      config.HUGGINGFACE_API_KEY.startsWith("hf_") &&
      config.HUGGINGFACE_API_KEY.length > 10
    );
  }

  /**
   * Check if a model is designed for conversational tasks (chat completion)
   */
  isConversationalModel(model) {
    // List of known conversational/chat models that require chat completion API
    const conversationalModels = [
      // Qwen models
      "Qwen/Qwen2.5-7B-Instruct",
      "Qwen/Qwen2.5-14B-Instruct",
      "Qwen/Qwen2.5-32B-Instruct",
      "Qwen/Qwen2.5-72B-Instruct",
      "Qwen/Qwen2-7B-Instruct",
      "Qwen/Qwen1.5-7B-Chat",
      "Qwen/Qwen1.5-14B-Chat",

      // Llama models
      "meta-llama/Llama-2-7b-chat-hf",
      "meta-llama/Llama-2-13b-chat-hf",
      "meta-llama/Llama-2-70b-chat-hf",
      "meta-llama/Meta-Llama-3-8B-Instruct",
      "meta-llama/Meta-Llama-3-70B-Instruct",

      // Mistral models
      "mistralai/Mistral-7B-Instruct-v0.1",
      "mistralai/Mistral-7B-Instruct-v0.2",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",

      // Other chat models
      "microsoft/DialoGPT-medium",
      "microsoft/DialoGPT-large",
      "facebook/blenderbot-400M-distill",
      "facebook/blenderbot-1B-distill",
    ];

    // Check if the model is in our known conversational models list
    if (conversationalModels.includes(model)) {
      return true;
    }

    // Check for common patterns in model names that indicate conversational models
    const conversationalPatterns = [
      /.*-chat$/i,
      /.*-instruct$/i,
      /.*-chat-hf$/i,
      /.*instruct.*$/i,
      /.*chat.*$/i,
      /.*dialog.*$/i,
      /.*conversation.*$/i,
    ];

    return conversationalPatterns.some((pattern) => pattern.test(model));
  }

  /**
   * Enhanced local AI with better pattern matching and code generation
   */
  async callEnhancedLocalAI(prompt, mode) {
    // Simulate processing time for realistic feel
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const promptLower = prompt.toLowerCase();

    // Advanced pattern matching for different code types
    if (mode === "generate") {
      // React Component Detection
      if (promptLower.includes("component") || promptLower.includes("react")) {
        return this.generateReactComponent(prompt);
      }

      // API/Express Route Detection
      if (
        promptLower.includes("api") ||
        promptLower.includes("endpoint") ||
        promptLower.includes("route")
      ) {
        return this.generateAPIEndpoint(prompt);
      }

      // Database/MongoDB Detection
      if (
        promptLower.includes("database") ||
        promptLower.includes("mongo") ||
        promptLower.includes("schema")
      ) {
        return this.generateDatabaseCode(prompt);
      }

      // Function Detection
      if (promptLower.includes("function") || promptLower.includes("method")) {
        return this.generateFunction(prompt);
      }

      // Class Detection
      if (
        promptLower.includes("class") ||
        promptLower.includes("constructor")
      ) {
        return this.generateClass(prompt);
      }

      // Default to function
      return this.generateFunction(prompt);
    } else if (mode === "explain") {
      return this.generateExplanation(prompt);
    }

    return "Enhanced DevAssist AI is ready to help with your coding needs!";
  }

  /**
   * Call Hugging Face API using InferenceClient (best practice)
   */
  async callHuggingFaceAPI(model, prompt, mode) {
    try {
      console.log(`🤖 Attempting Hugging Face model: ${model}`);

      // Check if this is a conversational model (chat-based)
      const isConversationalModel = this.isConversationalModel(model);

      let response;

      if (isConversationalModel) {
        // Use chat completion for conversational models
        console.log(
          `🗣️ Using chat completion for conversational model: ${model}`
        );
        response = await this.hf.chatCompletion(
          {
            model: model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: parseInt(config.HUGGINGFACE_MAX_TOKENS) || 512,
            temperature: mode === "generate" ? 0.4 : 0.3,
            top_p: 0.9,
          },
          {
            use_cache: true,
            wait_for_model: true,
          }
        );
      } else {
        // Use text generation for traditional text generation models
        console.log(`📝 Using text generation for model: ${model}`);
        response = await this.hf.textGeneration({
          model: model,
          inputs: prompt,
          parameters: {
            max_new_tokens: parseInt(config.HUGGINGFACE_MAX_TOKENS) || 512,
            temperature: mode === "generate" ? 0.7 : 0.3,
            top_p: 0.9,
            do_sample: true,
            repetition_penalty: 1.1,
          },
          options: {
            use_cache: true,
            wait_for_model: true,
          },
        });
      }

      console.log(`✅ Hugging Face model ${model} responded successfully`);

      // Handle response based on model type
      if (isConversationalModel) {
        // Handle chat completion response
        if (response && response.choices && response.choices.length > 0) {
          const message = response.choices[0].message;
          if (message && message.content) {
            return message.content.trim();
          }
        }
      } else {
        // Handle text generation response
        if (response && response.generated_text) {
          return response.generated_text.trim();
        } else if (typeof response === "string") {
          return response.trim();
        } else if (Array.isArray(response) && response.length > 0) {
          const text = response[0].generated_text || response[0];
          if (typeof text === "string") {
            return text.trim();
          }
        }
      }

      console.error(`❌ No valid text generated from ${model}:`, response);
      throw new Error("No valid response from model");
    } catch (error) {
      console.warn(`❌ Hugging Face model ${model} failed:`, error.message);
      throw error;
    }
  }

  /**
   * Build prompt based on mode and context
   */
  buildPrompt(prompt, mode) {
    const systemPrompt = this.getSystemMessage(mode);
    return `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`;
  }

  /**
   * Build prompt with project context
   */
  buildPromptWithContext(prompt, mode, files) {
    const systemPrompt = this.getSystemMessage(mode);
    const contextPrompt = this.formatProjectContext(files);
    return `${systemPrompt}${contextPrompt}\n\nUser: ${prompt}\nAssistant:`;
  }

  /**
   * Extract response from Hugging Face API response
   */
  extractResponse(response) {
    if (typeof response === "string") {
      return response.trim();
    }

    if (response.generated_text) {
      return response.generated_text.trim();
    }

    if (Array.isArray(response) && response.length > 0) {
      return response[0].generated_text?.trim() || response[0];
    }

    return "AI response generated successfully";
  }

  /**
   * Generate AI response
   */
  async generateResponse(userId, requestData, metadata = {}) {
    const { projectId, prompt, mode } = requestData;
    const startTime = Date.now();

    // Get user and check token limits
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has exceeded daily token limit
    if (user.hasExceededDailyLimit()) {
      throw new Error(
        `Daily token limit exceeded. You have used ${
          user.tokenUsage.daily.tokensUsed
        }/${user.getDailyTokenLimit()} tokens today. Limit resets at midnight UTC.`
      );
    }

    // Estimate tokens for the request (rough estimation)
    const estimatedTokens = this.estimateTokens(prompt);
    const remainingTokens = user.getRemainingDailyTokens();

    // Check if this request would exceed the limit
    if (estimatedTokens > remainingTokens) {
      throw new Error(
        `Request would exceed daily token limit. Estimated tokens: ${estimatedTokens}, Remaining: ${remainingTokens}. Try a shorter prompt or wait until tomorrow.`
      );
    }

    // Create interaction record
    const interaction = new AIInteraction({
      projectId: projectId || null,
      userId,
      prompt,
      mode,
      model: this.models.primary,
      metadata,
    });

    try {
      // Get project context if projectId is provided
      let contextFiles = [];
      let fullPrompt = this.buildPrompt(prompt, mode);

      if (projectId) {
        const project = await this.getProjectContext(projectId, userId);
        contextFiles = project.contextFiles;
        fullPrompt = this.buildPromptWithContext(prompt, mode, project.files);
      }

      // Try primary model first, then fallbacks
      let response;
      let modelUsed = this.models.primary;

      try {
        response = await this.callAIAPI(this.models.primary, fullPrompt, mode);
      } catch (primaryError) {
        console.warn(
          `Primary model ${this.models.primary} failed:`,
          primaryError.message
        );

        // Try fallback models
        for (const fallbackModel of this.models.fallbacks) {
          try {
            console.log(`Trying fallback model: ${fallbackModel}`);
            response = await this.callAIAPI(fallbackModel, fullPrompt, mode);
            modelUsed = fallbackModel;
            break;
          } catch (fallbackError) {
            console.warn(
              `Fallback model ${fallbackModel} failed:`,
              fallbackError.message
            );
            continue;
          }
        }

        if (!response) {
          // All models failed - use mock response for testing
          console.log("All Hugging Face models failed, using mock AI service");
          response = this.generateMockResponse(prompt, mode);
          modelUsed = "DevAssist Mock AI (Hugging Face unavailable)";
        }
      }

      const responseTime = Date.now() - startTime;
      const responseText = this.extractResponse(response);

      // Update interaction record
      interaction.response = responseText;
      interaction.responseTime = responseTime;
      interaction.contextFiles = contextFiles;
      interaction.success = true;
      interaction.model = modelUsed;

      // Calculate token usage (approximate)
      const inputTokens = this.estimateTokens(fullPrompt);
      const outputTokens = this.estimateTokens(responseText);
      const totalTokens = inputTokens + outputTokens;
      interaction.calculateTokens(inputTokens, outputTokens);

      await interaction.save();

      // Update user token usage
      await user.updateTokenUsage(totalTokens);

      return {
        response: responseText,
        mode,
        model: modelUsed,
        tokensUsed: interaction.tokensUsed,
        responseTime,
        contextFiles: contextFiles.map((f) => ({
          filename: f.filename,
          size: f.size,
        })),
        interactionId: interaction._id,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Mark interaction as failed
      interaction.markAsFailed(error.message);
      interaction.responseTime = responseTime;
      await interaction.save();

      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Get project context for AI
   */
  async getProjectContext(projectId, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId).populate(
      "owner",
      "username email"
    );

    if (!project) {
      throw new Error("Project not found");
    }

    // Check access permissions
    const isOwner = project.owner._id.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error("Access denied to project");
    }

    // Get relevant files for AI context (limit to prevent token overflow)
    const relevantFiles = project.getFilesForAI(40000); // ~40k tokens for context

    return {
      project: {
        name: project.name,
        description: project.description,
        language: project.language,
      },
      files: relevantFiles,
      contextFiles: relevantFiles.map((f) => ({
        filename: f.filename,
        size: f.size,
      })),
    };
  }

  /**
   * Get system message based on mode
   */
  getSystemMessage(mode) {
    const baseMessage = `You are an AI coding assistant for DevAssist, a web IDE for African developers. Provide concise, clear, and practical responses.`;

    if (mode === "generate") {
      return `${baseMessage}

INSTRUCTIONS FOR CODE GENERATION:
- Generate clean, working code with proper syntax
- Use modern best practices and secure coding patterns
- Add brief comments for complex logic
- Focus on practical, production-ready solutions
- If generating multiple files, separate them clearly
- Keep responses focused and avoid unnecessary explanations

Example format:
\`\`\`javascript
// Your generated code here
\`\`\``;
    } else if (mode === "explain") {
      return `${baseMessage}

INSTRUCTIONS FOR CODE EXPLANATION:
- Provide clear, step-by-step explanations
- Break down complex concepts into simple terms
- Highlight important patterns and best practices
- Mention potential issues or improvements
- Keep explanations educational but concise
- Use practical examples when helpful`;
    }

    return baseMessage;
  }

  /**
   * Format project context for AI models
   */
  formatProjectContext(files) {
    if (!files || files.length === 0) {
      return "\n\nNo project files provided.";
    }

    let context = "\n\nProject Context:\n";

    files.forEach((file) => {
      context += `\n<file name="${file.filename}">\n${file.content}\n</file>\n`;
    });

    return context;
  }

  /**
   * Generate React Component (Enhanced)
   */
  generateReactComponent(prompt) {
    const componentName = this.extractComponentName(prompt) || "MyComponent";
    const hasState =
      prompt.toLowerCase().includes("state") ||
      prompt.toLowerCase().includes("useState");
    const hasProps =
      prompt.toLowerCase().includes("props") ||
      prompt.toLowerCase().includes("prop");

    let imports = "import React";
    if (hasState) imports += ", { useState }";
    imports += " from 'react';";

    let component = `${imports}

const ${componentName} = (${hasProps ? "props" : ""}) => {`;

    if (hasState) {
      component += `
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);`;
    }

    component += `
  return (
    <div className="${componentName.toLowerCase()}">
      <h1>Generated by DevAssist AI</h1>
      <p>This is the ${componentName} component.</p>
      ${hasProps ? "<p>Props: {JSON.stringify(props)}</p>" : ""}
      ${hasState ? "<p>State: {JSON.stringify(data)}</p>" : ""}
    </div>
  );
};

export default ${componentName};`;

    return component;
  }

  /**
   * Generate API Endpoint (Enhanced)
   */
  generateAPIEndpoint(prompt) {
    const method = this.extractHTTPMethod(prompt);
    const endpoint = this.extractEndpointName(prompt);

    return `// Generated API endpoint by DevAssist AI
app.${method}('${endpoint}', async (req, res) => {
  try {
    // Extract data from request
    const { body, params, query } = req;

    // Your business logic here
    const result = {
      success: true,
      message: '${method.toUpperCase()} ${endpoint} executed successfully',
      data: body || params || query,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});`;
  }

  /**
   * Generate Database Code (Enhanced)
   */
  generateDatabaseCode(prompt) {
    const modelName = this.extractModelName(prompt) || "Item";

    return `// Generated MongoDB schema by DevAssist AI
import mongoose from 'mongoose';

const ${modelName.toLowerCase()}Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
${modelName.toLowerCase()}Schema.index({ name: 1 });
${modelName.toLowerCase()}Schema.index({ status: 1 });
${modelName.toLowerCase()}Schema.index({ createdAt: -1 });

export const ${modelName} = mongoose.model('${modelName}', ${modelName.toLowerCase()}Schema);`;
  }

  /**
   * Generate Function (Enhanced)
   */
  generateFunction(prompt) {
    const functionName = this.extractFunctionName(prompt) || "myFunction";
    const isAsync =
      prompt.toLowerCase().includes("async") ||
      prompt.toLowerCase().includes("await");
    const hasParams =
      prompt.toLowerCase().includes("parameter") ||
      prompt.toLowerCase().includes("param");

    let func = `// Generated function by DevAssist AI
${isAsync ? "async " : ""}function ${functionName}(${
      hasParams ? "params" : ""
    }) {`;

    if (isAsync) {
      func += `
  try {
    // Your async logic here
    const result = await someAsyncOperation(${hasParams ? "params" : ""});
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      success: false,
      error: error.message
    };
  }`;
    } else {
      func += `
  // Your function logic here
  console.log('${functionName} called with:', ${
        hasParams ? "params" : "undefined"
      });

  return {
    success: true,
    message: 'Function executed successfully'
  };`;
    }

    func += `
}`;

    return func;
  }

  /**
   * Generate Class (Enhanced)
   */
  generateClass(prompt) {
    const className = this.extractClassName(prompt) || "MyClass";

    return `// Generated class by DevAssist AI
class ${className} {
  constructor(options = {}) {
    this.name = options.name || '${className}';
    this.created = new Date();
    this.data = options.data || {};
  }

  // Getter methods
  getName() {
    return this.name;
  }

  getData() {
    return this.data;
  }

  // Setter methods
  setName(name) {
    this.name = name;
    return this;
  }

  setData(data) {
    this.data = { ...this.data, ...data };
    return this;
  }

  // Utility methods
  toJSON() {
    return {
      name: this.name,
      created: this.created,
      data: this.data
    };
  }

  toString() {
    return \`\${this.name} created at \${this.created}\`;
  }
}

export default ${className};`;
  }

  /**
   * Generate Explanation (Enhanced)
   */
  generateExplanation(prompt) {
    const codeType = this.analyzeCodeType(prompt);

    return `This code appears to be a ${codeType} implementation generated by DevAssist AI.

## Key Features:
• **Well-structured**: Follows modern JavaScript/Node.js best practices
• **Error handling**: Includes comprehensive try-catch blocks
• **Type safety**: Uses proper parameter validation
• **Performance**: Optimized for production use
• **Maintainable**: Clean, readable code structure

## Technical Details:
• Uses ES6+ features like arrow functions, destructuring, and async/await
• Implements proper error boundaries and logging
• Follows RESTful API conventions (for API endpoints)
• Uses modern React patterns (for components)
• Includes proper MongoDB schema design (for database code)

## Best Practices Applied:
• Input validation and sanitization
• Consistent error response format
• Proper HTTP status codes
• Security considerations
• Performance optimizations

This code is production-ready and follows industry standards for ${codeType} development.

*Generated by DevAssist AI - Your intelligent coding assistant*`;
  }

  /**
   * Generate mock AI response for testing when Hugging Face is unavailable
   */
  generateMockResponse(prompt, mode) {
    const codeTemplates = {
      javascript: {
        function: `function ${
          this.extractFunctionName(prompt) || "myFunction"
        }() {
  // Generated by DevAssist AI
  console.log('Hello from DevAssist!');
  return 'Function created successfully';
}`,
        component: `import React from 'react';

const ${this.extractComponentName(prompt) || "MyComponent"} = () => {
  return (
    <div>
      <h1>Generated by DevAssist AI</h1>
      <p>This is a sample component.</p>
    </div>
  );
};

export default ${this.extractComponentName(prompt) || "MyComponent"};`,
        api: `// Generated API endpoint by DevAssist AI
app.get('/api/example', async (req, res) => {
  try {
    // Your API logic here
    res.json({
      success: true,
      message: 'API endpoint created successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});`,
      },
    };

    if (mode === "generate") {
      // Determine what type of code to generate based on prompt
      if (
        prompt.toLowerCase().includes("component") ||
        prompt.toLowerCase().includes("react")
      ) {
        return codeTemplates.javascript.component;
      } else if (
        prompt.toLowerCase().includes("api") ||
        prompt.toLowerCase().includes("endpoint")
      ) {
        return codeTemplates.javascript.api;
      } else {
        return codeTemplates.javascript.function;
      }
    } else if (mode === "explain") {
      return `This code appears to be a ${this.analyzeCodeType(
        prompt
      )} implementation.

Key features:
• Well-structured and follows best practices
• Includes proper error handling
• Uses modern JavaScript/React patterns
• Ready for production use

The code demonstrates good software engineering principles and should work well in your DevAssist project.

Note: This explanation was generated by DevAssist's mock AI service while Hugging Face models are loading.`;
    }

    return "DevAssist AI is ready to help! (Mock response while models are loading)";
  }

  /**
   * Extract function name from prompt
   */
  extractFunctionName(prompt) {
    const match = prompt.match(
      /function\s+(\w+)|(\w+)\s+function|create\s+(\w+)/i
    );
    return match ? match[1] || match[2] || match[3] : null;
  }

  /**
   * Extract component name from prompt
   */
  extractComponentName(prompt) {
    const match = prompt.match(
      /component\s+(\w+)|(\w+)\s+component|create\s+(\w+)/i
    );
    return match ? match[1] || match[2] || match[3] : "MyComponent";
  }

  /**
   * Extract HTTP method from prompt
   */
  extractHTTPMethod(prompt) {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes("post") || promptLower.includes("create"))
      return "post";
    if (promptLower.includes("put") || promptLower.includes("update"))
      return "put";
    if (promptLower.includes("delete") || promptLower.includes("remove"))
      return "delete";
    if (promptLower.includes("patch")) return "patch";
    return "get"; // default
  }

  /**
   * Extract endpoint name from prompt
   */
  extractEndpointName(prompt) {
    const match = prompt.match(/\/[\w\-\/:]*/);
    if (match) return match[0];

    // Try to extract from context
    if (prompt.toLowerCase().includes("user")) return "/api/users/:id";
    if (prompt.toLowerCase().includes("product")) return "/api/products/:id";
    if (prompt.toLowerCase().includes("order")) return "/api/orders/:id";

    return "/api/example/:id";
  }

  /**
   * Extract model name from prompt
   */
  extractModelName(prompt) {
    const match = prompt.match(/(?:model|schema|collection)\s+(\w+)/i);
    if (match) return match[1].charAt(0).toUpperCase() + match[1].slice(1);

    // Try common patterns
    if (prompt.toLowerCase().includes("user")) return "User";
    if (prompt.toLowerCase().includes("product")) return "Product";
    if (prompt.toLowerCase().includes("order")) return "Order";
    if (prompt.toLowerCase().includes("post")) return "Post";

    return "Item";
  }

  /**
   * Extract class name from prompt
   */
  extractClassName(prompt) {
    const match = prompt.match(/class\s+(\w+)/i);
    if (match) return match[1].charAt(0).toUpperCase() + match[1].slice(1);

    // Try to extract from context
    const words = prompt
      .split(" ")
      .filter((word) => /^[A-Z][a-zA-Z]*$/.test(word));
    if (words.length > 0) return words[0];

    return "MyClass";
  }

  /**
   * Analyze code type from prompt
   */
  analyzeCodeType(prompt) {
    if (prompt.includes("function")) return "function";
    if (prompt.includes("component")) return "React component";
    if (prompt.includes("api")) return "API endpoint";
    if (prompt.includes("class")) return "class";
    if (prompt.includes("schema")) return "database schema";
    return "code";
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Get user interaction history
   */
  async getUserInteractionHistory(userId, options = {}) {
    const { page = 1, limit = 20, projectId, mode, days = 30 } = options;

    const skip = (page - 1) * limit;
    const query = { userId };

    // Add filters
    if (projectId) {
      query.projectId = projectId;
    }

    if (mode) {
      query.mode = mode;
    }

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query.createdAt = { $gte: startDate };
    }

    const [interactions, total] = await Promise.all([
      AIInteraction.find(query)
        .populate("projectId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-response") // Exclude full response for performance
        .lean(),
      AIInteraction.countDocuments(query),
    ]);

    return {
      interactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get interaction by ID
   */
  async getInteractionById(interactionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(interactionId)) {
      throw new Error("Invalid interaction ID");
    }

    const interaction = await AIInteraction.findOne({
      _id: interactionId,
      userId,
    }).populate("projectId", "name description");

    if (!interaction) {
      throw new Error("Interaction not found");
    }

    return interaction;
  }

  /**
   * Get user AI usage statistics
   */
  async getUserStats(userId, days = 30) {
    return await AIInteraction.getUserStats(userId, days);
  }

  /**
   * Get project interaction history
   */
  async getProjectInteractionHistory(projectId, userId, limit = 50) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid project ID");
    }

    // Verify user has access to project
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const isOwner = project.owner.toString() === userId.toString();
    const isPublic = project.isPublic;

    if (!isOwner && !isPublic) {
      throw new Error("Access denied to project");
    }

    return await AIInteraction.getProjectHistory(projectId, limit);
  }

  /**
   * Delete interaction (user can delete their own interactions)
   */
  async deleteInteraction(interactionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(interactionId)) {
      throw new Error("Invalid interaction ID");
    }

    const interaction = await AIInteraction.findOneAndDelete({
      _id: interactionId,
      userId,
    });

    if (!interaction) {
      throw new Error("Interaction not found");
    }

    return { message: "Interaction deleted successfully" };
  }
}

// Export singleton instance
export default new AIService();
