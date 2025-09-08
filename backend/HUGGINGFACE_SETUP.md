# Hugging Face API Setup Guide

## 🤗 Why Hugging Face?

Hugging Face Inference API is an excellent **FREE** alternative to paid AI services like OpenAI or Anthropic. It provides:

- ✅ **Free API access** to thousands of models
- ✅ **No credit card required** for basic usage
- ✅ **Excellent code generation models** like Qwen2.5-Coder
- ✅ **High rate limits** for free tier
- ✅ **Easy integration** with simple REST API

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Hugging Face Account

1. Go to [huggingface.co](https://huggingface.co)
2. Click **"Sign Up"** in the top right
3. Create account with email or GitHub
4. Verify your email address

### Step 2: Generate API Token

1. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
2. Click **"New token"**
3. Give it a name like "DevAssist API"
4. Select **"Read"** permission (sufficient for inference)
5. Click **"Generate a token"**
6. **Copy the token** - you won't see it again!

### Step 3: Add to Environment

Add your token to the `.env` file:

```env
HUGGINGFACE_API_KEY=hf_your_token_here_1234567890abcdef
```

### Step 4: Test the Integration

```bash
# Start the server
npm run dev

# Test AI health check
curl http://localhost:5001/api/ai/health
```

## 🎯 Recommended Models

DevAssist automatically detects model types and uses the appropriate API:

### 🗣️ **Conversational Models (Chat Completion API)**

- **Qwen/Qwen2.5-7B-Instruct** ⭐ - Excellent for code generation and explanations
- **Qwen/Qwen2.5-14B-Instruct** - Larger model for complex tasks
- **meta-llama/Meta-Llama-3-8B-Instruct** - Meta's instruction-tuned model
- **mistralai/Mistral-7B-Instruct-v0.2** - Fast and efficient chat model

### 📝 **Text Generation Models (Text Generation API)**

- **gpt2** - Classic text generation, fast and reliable
- **distilgpt2** - Smaller, faster version of GPT-2
- **Salesforce/codegen-350M-mono** - Specialized for code generation

### 🔄 **Automatic Model Detection**

DevAssist automatically:

- ✅ Detects if a model is conversational (chat/instruct) or text generation
- ✅ Uses the correct API method (`chatCompletion` vs `textGeneration`)
- ✅ Handles responses appropriately for each model type
- ✅ Falls back to alternative models if primary fails

## 🔧 Configuration Options

### Default Configuration

```env
HUGGINGFACE_API_KEY=your-token-here
HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct
HUGGINGFACE_MAX_TOKENS=512
```

### Alternative Models

You can change the primary model (DevAssist will auto-detect the type):

```env
# For conversational models (uses chat completion)
HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct
HUGGINGFACE_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# For text generation models (uses text generation)
HUGGINGFACE_MODEL=gpt2
HUGGINGFACE_MODEL=distilgpt2
HUGGINGFACE_MODEL=Salesforce/codegen-350M-mono
```

### Model Type Detection

DevAssist automatically detects model types based on:

- **Model name patterns**: `-instruct`, `-chat`, `-hf` suffixes
- **Known model lists**: Pre-configured list of popular conversational models
- **Fallback handling**: If detection fails, tries both APIs automatically

## 📊 Free Tier Limits

Hugging Face Inference API free tier includes:

- ✅ **1,000 requests per hour** per model
- ✅ **Access to 100,000+ models**
- ✅ **No credit card required**
- ✅ **Community support**

For higher usage, paid plans start at $9/month.

## 🛠️ Troubleshooting

### Common Issues

#### 1. **"Invalid API key" Error**

```bash
# Check your token format
echo $HUGGINGFACE_API_KEY
# Should start with "hf_"
```

**Solution**: Regenerate token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

#### 2. **"Model not supported for task" Error**

```bash
# Example error:
# "Model Qwen/Qwen2.5-7B-Instruct is not supported for task text-generation. Supported task: conversational."
```

**Solution**: DevAssist now automatically detects this and uses the correct API. If you see this error, update to the latest version.

#### 3. **"Rate limit exceeded" Error**

```json
{
  "error": "Rate limit exceeded"
}
```

**Solution**: Wait a few minutes or upgrade to paid plan

#### 4. **"Model is loading" Error**

```json
{
  "error": "Model is currently loading"
}
```

**Solution**: Wait 1-2 minutes for model to warm up, then retry

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
```

This will show detailed API requests and responses.

## 🔄 Model Fallback System

DevAssist automatically tries multiple models with intelligent API selection:

1. **Primary model** (e.g., Qwen/Qwen2.5-7B-Instruct) - Uses chat completion API
2. **Fallback 1** (microsoft/DialoGPT-medium) - Conversational fallback
3. **Fallback 2** (gpt2) - Text generation fallback
4. **Fallback 3** (distilgpt2) - Fast text generation
5. **Mock AI** - Always works for testing

### Smart API Selection

- **Conversational models**: Automatically uses `chatCompletion` API
- **Text generation models**: Automatically uses `textGeneration` API
- **Error handling**: Falls back to mock AI if all models fail

This ensures high availability and correct API usage for all model types.

## 📈 Performance Tips

### 1. **Optimize Prompts**

```javascript
// Good: Specific and clear
"Create a React login component with email and password fields";

// Bad: Vague and unclear
"Make a form";
```

### 2. **Use Project Context**

Include relevant files for better results:

```javascript
const result = await generateAIResponse(
  "Add authentication to this component",
  "generate",
  projectId // Include project context
);
```

### 3. **Choose Right Mode**

- **"generate"** - For creating new code
- **"explain"** - For understanding existing code

## 🔒 Security Best Practices

### 1. **Keep API Key Secret**

```bash
# ✅ Good: Use environment variables
HUGGINGFACE_API_KEY=hf_your_token

# ❌ Bad: Hard-code in source
const apiKey = "hf_your_token";
```

### 2. **Use Read-Only Tokens**

- Only request "Read" permission
- Don't use "Write" unless needed

### 3. **Rotate Tokens Regularly**

- Generate new tokens monthly
- Delete old unused tokens

## 🚀 Advanced Usage

### Custom Model Configuration

```javascript
// In aiService.js, you can add custom models
this.models = {
  primary: "your-custom-model",
  fallbacks: ["bigcode/starcoder2-15b", "microsoft/DialoGPT-large"],
};
```

### Fine-tuned Models

If you have fine-tuned models:

```env
HUGGINGFACE_MODEL=your-username/your-fine-tuned-model
```

## 📞 Support

### Hugging Face Resources

- **Documentation**: [huggingface.co/docs](https://huggingface.co/docs)
- **Community**: [discuss.huggingface.co](https://discuss.huggingface.co)
- **Status**: [status.huggingface.co](https://status.huggingface.co)

### DevAssist Support

- **Health Check**: `GET /api/ai/health`
- **Model Info**: Check server logs for model fallbacks
- **GitHub Issues**: Report problems in the repository

## 🎉 Success!

Once configured, you'll have:

✅ **Free AI-powered code generation**  
✅ **Multiple model fallbacks for reliability**  
✅ **Fast response times**  
✅ **No usage costs for basic usage**  
✅ **Production-ready AI integration**

Your DevAssist backend is now powered by state-of-the-art AI models, completely free! 🚀

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or create an issue in the repository.
