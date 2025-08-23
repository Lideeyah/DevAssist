# 🧪 Complete API Testing Guide

## 🎯 Overview

This guide provides comprehensive testing for all DevAssist APIs including:

- ✅ **Authentication & User Management**
- ✅ **Project Management**
- ✅ **File Operations**
- ✅ **AI Features with Token Limits**
- ✅ **Token Usage Management**

## 🚀 Quick Start

### Prerequisites

1. **MongoDB Atlas** configured in `.env`
2. **Hugging Face API key** configured in `.env`
3. **Server running** on `http://localhost:5001`

### Run Complete Test Suite

```bash
# Start the server
npm run dev

# In another terminal, run comprehensive tests
node test-complete-api.js
```

## 📋 Test Scenarios Covered

### 1. **Authentication Flow**

- ✅ User registration with different roles
- ✅ User login and token generation
- ✅ Token refresh functionality
- ✅ Protected route access

### 2. **Project Management**

- ✅ Create projects with different languages
- ✅ List user projects with pagination
- ✅ Update project details
- ✅ Delete projects
- ✅ Project access control

### 3. **File Operations**

- ✅ Create files in projects
- ✅ Read file contents
- ✅ Update file contents
- ✅ Delete files
- ✅ List project files
- ✅ File validation and limits

### 4. **AI Features**

- ✅ Token usage checking
- ✅ Token limit enforcement
- ✅ Code generation requests (with automatic model type detection)
- ✅ Code explanation requests (supports both conversational and text generation models)
- ✅ Project context integration
- ✅ AI interaction history
- ✅ Usage statistics
- ✅ Model fallback system for high availability

### 5. **Token Management**

- ✅ Role-based daily limits
- ✅ Usage tracking and updates
- ✅ Limit exceeded handling
- ✅ Request estimation
- ✅ Automatic daily resets

## 🎭 Test User Roles

### Developer (10K tokens/day)

```json
{
  "username": "dev_user",
  "email": "dev@devassist.com",
  "password": "DevPass123",
  "role": "developer"
}
```

### SME (25K tokens/day)

```json
{
  "username": "sme_user",
  "email": "sme@devassist.com",
  "password": "SMEPass123",
  "role": "sme"
}
```

### Admin (100K tokens/day)

```json
{
  "username": "admin_user",
  "email": "admin@devassist.com",
  "password": "AdminPass123",
  "role": "admin"
}
```

## 📊 Expected Results

### Authentication Tests

- ✅ **Registration**: Returns user data with JWT tokens
- ✅ **Login**: Returns access and refresh tokens
- ✅ **Token Refresh**: Returns new access token
- ✅ **Protected Access**: Requires valid JWT

### Project Tests

- ✅ **Create Project**: Returns project with owner info
- ✅ **List Projects**: Returns paginated project list
- ✅ **Update Project**: Returns updated project data
- ✅ **Delete Project**: Returns success confirmation

### File Tests

- ✅ **Create File**: Returns file metadata
- ✅ **Read File**: Returns file content
- ✅ **Update File**: Returns updated file info
- ✅ **Delete File**: Returns success confirmation

### AI Tests

- ✅ **Token Check**: Returns current usage and limits
- ✅ **Can Request**: Returns ability to make AI requests
- ✅ **Generate Code**: Returns AI-generated code
- ✅ **Explain Code**: Returns code explanations
- ✅ **Usage Tracking**: Updates token usage after requests

### Token Limit Tests

- ✅ **Role Limits**: Different limits per role
- ✅ **Usage Tracking**: Accurate token counting
- ✅ **Limit Enforcement**: Blocks requests when exceeded
- ✅ **Error Messages**: Clear limit exceeded messages

## 🔍 Manual Testing Steps

### Step 1: Authentication

```bash
# Register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@devassist.com",
    "password": "TestPass123",
    "role": "developer"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@devassist.com",
    "password": "TestPass123"
  }'
```

### Step 2: Project Management

```bash
# Create project (use token from login)
curl -X POST http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Testing project creation",
    "language": "javascript"
  }'

# List projects
curl -X GET http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 3: File Operations

```bash
# Create file in project
curl -X POST http://localhost:5001/api/projects/PROJECT_ID/files \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "app.js",
    "content": "console.log(\"Hello World\");",
    "language": "javascript"
  }'

# Get file
curl -X GET http://localhost:5001/api/projects/PROJECT_ID/files/app.js \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Token Usage

```bash
# Check token usage
curl -X GET http://localhost:5001/api/ai/token-usage \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Check if can make AI request
curl -X GET http://localhost:5001/api/ai/can-request \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 5: AI Features

```bash
# Generate code
curl -X POST http://localhost:5001/api/ai/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple React component for a login form",
    "mode": "generate",
    "projectId": "PROJECT_ID"
  }'

# Explain code
curl -X POST http://localhost:5001/api/ai/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain how this authentication system works",
    "mode": "explain",
    "projectId": "PROJECT_ID"
  }'
```

## 🚨 Error Scenarios to Test

### Token Limit Errors

- ✅ **Daily limit exceeded**: Should return 429 with clear message
- ✅ **Request too large**: Should estimate and block large requests
- ✅ **Invalid user**: Should return 404 for missing users

### Authentication Errors

- ✅ **Invalid credentials**: Should return 401
- ✅ **Expired token**: Should return 401 with refresh suggestion
- ✅ **Missing token**: Should return 401

### Project Errors

- ✅ **Unauthorized access**: Should return 403
- ✅ **Project not found**: Should return 404
- ✅ **Invalid data**: Should return 400 with validation errors

### File Errors

- ✅ **File not found**: Should return 404
- ✅ **Invalid filename**: Should return 400
- ✅ **File too large**: Should return 413

## 📈 Performance Benchmarks

### Expected Response Times

- **Authentication**: < 500ms
- **Project Operations**: < 200ms
- **File Operations**: < 300ms
- **AI Requests**: < 10s (depends on model)
- **Token Checks**: < 100ms

### Concurrent Users

- **Target**: 100 concurrent users
- **Rate Limits**: Properly enforced
- **Database**: Optimized with indexes

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check MONGODB_URI in .env
2. **Hugging Face API**: Verify HUGGINGFACE_API_KEY and HUGGINGFACE_MODEL
3. **Port Conflicts**: Ensure port 5001 is available
4. **Token Expiry**: Refresh tokens when needed

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev
```

## 📝 Test Checklist

### Before Frontend Handoff

- [ ] All authentication flows working
- [ ] Project CRUD operations complete
- [ ] File operations functional
- [ ] AI features responding correctly
- [ ] Token limits enforcing properly
- [ ] Error messages user-friendly
- [ ] Response times acceptable
- [ ] Documentation up to date

### Frontend Integration Points

- [ ] JWT token handling
- [ ] Error response formats
- [ ] Pagination parameters
- [ ] File upload limits
- [ ] Token usage display
- [ ] AI request optimization

## 🎉 Success Criteria

### API Readiness

- ✅ **100% test pass rate**
- ✅ **All endpoints documented**
- ✅ **Error handling complete**
- ✅ **Performance benchmarks met**
- ✅ **Security measures active**

### Frontend Ready Features

- ✅ **User authentication system**
- ✅ **Project management interface**
- ✅ **File editor integration**
- ✅ **AI-powered code assistance**
- ✅ **Token usage monitoring**

Your DevAssist backend is now **production-ready** for frontend integration! 🚀
