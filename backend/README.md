# DevAssist Backend

> AI-powered multi-role web IDE backend for African developers, teams, and SMEs

## 🌍 Overview

DevAssist is a comprehensive backend solution designed specifically for African developers, teams, and SMEs. It provides a robust foundation for an AI-powered web IDE with features including user management, project collaboration, file handling, and AI-powered code assistance using Hugging Face's free Inference API.

## ✨ Features

- **🔐 Authentication & Authorization**: JWT-based auth with role-based access control
- **👥 User Management**: Support for developers, admins, and SME roles
- **📁 Project Management**: Create, manage, and collaborate on coding projects
- **📄 File Management**: Full CRUD operations for project files with size limits
- **🤖 AI Integration**: Hugging Face-powered code generation and explanation with automatic model type detection
- **🎯 Token Management**: Role-based daily limits with automatic usage tracking
- **🔒 Security**: Comprehensive security middleware and rate limiting
- **📊 Analytics**: Track AI usage and project statistics
- **🌐 CORS**: Configurable cross-origin resource sharing
- **📝 Logging**: Comprehensive request and error logging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Hugging Face API key (free)

### Installation

1. **Clone and setup**

   ```bash
   git clone <repository-url>
   cd devassist-backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**

   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devassist

   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key

   # Hugging Face API (Free)
   HUGGINGFACE_API_KEY=your-huggingface-api-key
   HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get user profile
- `PUT /auth/me` - Update profile
- `POST /auth/logout` - Logout user

#### Projects

- `GET /projects` - Get user projects
- `POST /projects` - Create new project
- `GET /projects/public` - Get public projects
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Files

- `GET /projects/:id/files` - Get project files
- `POST /projects/:id/files` - Create file
- `GET /projects/:id/files/:filename` - Get file
- `PUT /projects/:id/files/:filename` - Update file
- `DELETE /projects/:id/files/:filename` - Delete file

#### AI Integration

- `POST /ai/generate` - Generate AI response (supports both conversational and text generation models)
- `GET /ai/history` - Get interaction history
- `GET /ai/stats` - Get usage statistics
- `GET /ai/token-usage` - Get token usage and limits
- `GET /ai/can-request` - Check if user can make AI requests
- `GET /ai/health` - Check AI service health and model compatibility

## 🎯 Token Management System

### Daily Token Limits by Role

- **Developer**: 10,000 tokens per day
- **SME**: 25,000 tokens per day
- **Admin**: 100,000 tokens per day

### Token Usage Tracking

```bash
# Check current token usage
curl -X GET http://localhost:5001/api/ai/token-usage \
  -H "Authorization: Bearer <token>"

# Check if user can make AI request
curl -X GET http://localhost:5001/api/ai/can-request \
  -H "Authorization: Bearer <token>"
```

### Automatic Features

- ✅ **Daily Reset**: Limits reset automatically at midnight UTC
- ✅ **Usage Tracking**: Real-time token consumption monitoring
- ✅ **Request Blocking**: Prevents requests that exceed daily limits
- ✅ **Smart Estimation**: Estimates token usage before processing
- ✅ **Helpful Errors**: Clear messages when limits are exceeded

### Request Examples

#### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "developer1",
    "email": "dev@example.com",
    "password": "SecurePass123",
    "role": "developer"
  }'
```

#### Create Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Web App",
    "description": "A sample web application",
    "language": "javascript"
  }'
```

#### AI Code Generation

```bash
curl -X POST http://localhost:5001/api/ai/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a React component for a login form",
    "mode": "generate",
    "projectId": "project-id-here"
  }'
```

## 🏗️ Architecture

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── app.js           # Express app setup
└── server.js        # Server startup
```

### Database Models

#### User

- Username, email, password (hashed)
- Role: developer, admin, sme
- Authentication tokens

#### Project

- Name, description, owner
- Files (embedded documents)
- Language, tags, visibility

#### AIInteraction

- User, project, prompt, response
- Usage statistics and metadata

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Configurable limits per endpoint
- **CORS Protection**: Whitelist allowed origins
- **Security Headers**: Helmet.js integration
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## 📊 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 10 requests per 15 minutes
- **AI Generation**: 100 requests per hour (varies by role)
- **File Operations**: 50 requests per 10 minutes
- **Project Creation**: 20 requests per hour

## 🚀 Deployment

### Render Deployment

1. **Connect Repository**: Link your GitHub repository to Render

2. **Environment Variables**: Set all required environment variables in Render dashboard

3. **Build Command**: `npm install`

4. **Start Command**: `npm start`

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
HUGGINGFACE_API_KEY=your-huggingface-api-key
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📈 Monitoring

The API includes built-in monitoring endpoints:

- `GET /api/health` - Service health check
- `GET /api/ai/health` - AI service status
- `GET /api/version` - API version info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the health check at `/api/health`

---

## 🔧 Development

### Local Development Setup

1. **Database Setup**

   - Create MongoDB Atlas cluster
   - Get connection string
   - Create database named `devassist`

2. **API Keys**

   - Sign up for Hugging Face (free)
   - Get your API key from the dashboard

3. **Development Workflow**

   ```bash
   # Start development server with auto-reload
   npm run dev

   # Check logs
   tail -f logs/app.log

   # Test API endpoints
   curl http://localhost:5000/api/health
   ```

### Code Style

- ES6+ modules
- Async/await (no callbacks)
- Clean architecture pattern
- Comprehensive error handling
- JSDoc comments for functions

### Performance Considerations

- **File Size Limits**: 200KB per file, 100 files per project
- **Token Limits**: AI requests limited by model context window
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Response caching for public endpoints (future enhancement)

**Built with ❤️ for African developers by the DevAssist team**
