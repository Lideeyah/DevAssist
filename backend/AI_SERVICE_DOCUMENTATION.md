# AI Service Documentation

## Overview

The DevAssist AI Service provides intelligent code generation and explanation capabilities using Hugging Face's Inference API. The service automatically detects model types and uses the appropriate API methods for optimal compatibility.

## Key Features

### 🔄 **Automatic Model Type Detection**
- Detects conversational models (chat/instruct) vs text generation models
- Uses appropriate API methods (`chatCompletion` vs `textGeneration`)
- Handles responses correctly for each model type

### 🛡️ **Robust Fallback System**
- Multiple model fallbacks for high availability
- Automatic retry with different models if primary fails
- Mock AI service as final fallback for testing

### 🎯 **Smart Context Management**
- Project-aware code generation
- Token usage optimization
- File context filtering for relevance

## Supported Model Types

### Conversational Models (Chat Completion API)
These models are designed for instruction-following and conversation:

- **Qwen Models**: `Qwen/Qwen2.5-7B-Instruct`, `Qwen/Qwen2.5-14B-Instruct`
- **Llama Models**: `meta-llama/Meta-Llama-3-8B-Instruct`
- **Mistral Models**: `mistralai/Mistral-7B-Instruct-v0.2`
- **DialoGPT**: `microsoft/DialoGPT-medium`

### Text Generation Models (Text Generation API)
These models are designed for text completion:

- **GPT Models**: `gpt2`, `distilgpt2`
- **Code Models**: `Salesforce/codegen-350M-mono`

## Model Detection Logic

The service uses multiple methods to detect model types:

1. **Explicit Model List**: Known conversational models are pre-configured
2. **Pattern Matching**: Models ending in `-instruct`, `-chat`, `-hf` are treated as conversational
3. **Keyword Detection**: Models containing "chat", "instruct", "dialog" keywords

## API Usage

### Basic AI Generation

```javascript
const result = await aiService.generateResponse(userId, {
  prompt: "Create a React login component",
  mode: "generate",
  projectId: "optional-project-id"
});
```

### Response Format

```javascript
{
  response: "Generated code or explanation",
  mode: "generate|explain",
  model: "model-name-used",
  tokensUsed: {
    input: 150,
    output: 300,
    total: 450
  },
  responseTime: 2500,
  contextFiles: [
    { filename: "app.js", size: 1024 }
  ],
  interactionId: "interaction-id"
}
```

## Configuration

### Environment Variables

```env
HUGGINGFACE_API_KEY=hf_your_token_here
HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct
HUGGINGFACE_MAX_TOKENS=512
```

### Model Configuration

```javascript
// In aiService.js
this.models = {
  primary: config.HUGGINGFACE_MODEL || "microsoft/DialoGPT-medium",
  fallbacks: [
    "microsoft/DialoGPT-medium", // Conversational
    "gpt2",                      // Text generation
    "distilgpt2",               // Fast text generation
    "Salesforce/codegen-350M-mono" // Code generation
  ]
};
```

## Error Handling

### Common Errors and Solutions

#### Model Not Supported for Task
```
Error: Model Qwen/Qwen2.5-7B-Instruct is not supported for task text-generation. Supported task: conversational.
```
**Solution**: The service now automatically detects this and uses chat completion API.

#### Rate Limit Exceeded
```
Error: Rate limit exceeded
```
**Solution**: Service automatically falls back to alternative models.

#### Model Loading
```
Error: Model is currently loading
```
**Solution**: Service waits and retries, or falls back to alternative models.

## Token Management

### Daily Limits by Role
- **Developer**: 10,000 tokens/day
- **SME**: 25,000 tokens/day  
- **Admin**: 100,000 tokens/day

### Token Estimation
The service estimates token usage before processing to prevent exceeding limits.

## Performance Optimization

### Best Practices

1. **Use Project Context**: Include relevant files for better results
2. **Optimize Prompts**: Be specific and clear in requests
3. **Choose Right Mode**: Use "generate" for code creation, "explain" for understanding

### Caching
- Model responses are cached when possible
- Context files are optimized for token efficiency

## Monitoring and Health Checks

### Health Check Endpoint
```http
GET /api/ai/health
```

Returns service status and model availability.

### Logging
The service logs:
- Model selection decisions
- API method used (chat vs text generation)
- Fallback attempts
- Response times and token usage

## Future Enhancements

- Support for streaming responses
- Custom model fine-tuning integration
- Advanced context management
- Multi-modal capabilities (code + images)

---

For more information, see:
- [Hugging Face Setup Guide](./HUGGINGFACE_SETUP.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
