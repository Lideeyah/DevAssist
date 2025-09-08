# DevAssist Backend Architecture

## Overview

DevAssist backend follows a clean, modular architecture designed for scalability, maintainability, and security. The system is built using Node.js with Express.js framework, MongoDB for data persistence, and integrates with Hugging Face Inference API for AI-powered features with automatic model type detection.

## Architecture Principles

### 1. Clean Architecture

- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Interface Segregation**: Clients depend only on interfaces they use
- **Single Responsibility**: Each class/module has one reason to change

### 2. Layered Architecture

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│         (Routes & Controllers)          │
├─────────────────────────────────────────┤
│              Business Layer             │
│            (Services & Logic)           │
├─────────────────────────────────────────┤
│              Data Access Layer          │
│           (Models & Database)           │
├─────────────────────────────────────────┤
│             Infrastructure Layer        │
│        (External APIs & Utilities)     │
└─────────────────────────────────────────┘
```

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── env.js          # Environment variables
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── projectController.js
│   ├── fileController.js
│   └── aiController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   ├── cors.js         # CORS configuration
│   ├── errorHandler.js # Error handling
│   └── rateLimiter.js  # Rate limiting
├── models/             # Database models
│   ├── User.js         # User schema
│   ├── Project.js      # Project schema
│   ├── AIInteraction.js # AI interaction schema
│   └── index.js        # Model exports
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── projects.js     # Project routes
│   ├── files.js        # File routes
│   ├── ai.js          # AI routes
│   └── index.js        # Route aggregation
├── services/           # Business logic
│   ├── authService.js  # Authentication logic
│   ├── projectService.js # Project logic
│   ├── fileService.js  # File logic
│   └── aiService.js    # AI integration logic
├── utils/              # Utility functions
│   ├── constants.js    # Application constants
│   ├── helpers.js      # Helper functions
│   ├── jwt.js         # JWT utilities
│   └── validation.js   # Input validation
├── app.js              # Express app setup
└── server.js           # Server startup
```

## Data Flow

### Request Processing Flow

```
Client Request
    ↓
CORS Middleware
    ↓
Rate Limiting
    ↓
Request Parsing
    ↓
Authentication (if required)
    ↓
Route Handler
    ↓
Controller
    ↓
Service Layer
    ↓
Database/External API
    ↓
Response Formatting
    ↓
Client Response
```

### Error Handling Flow

```
Error Occurs
    ↓
Catch in Controller/Middleware
    ↓
Global Error Handler
    ↓
Error Classification
    ↓
Response Formatting
    ↓
Client Error Response
```

## Database Design

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: developer, admin, sme),
  isActive: Boolean,
  lastLogin: Date,
  refreshTokens: [{ token: String, createdAt: Date }],
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  files: [{
    filename: String,
    content: String,
    size: Number,
    mimeType: String,
    lastModified: Date
  }],
  isPublic: Boolean,
  tags: [String],
  language: String,
  lastActivity: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### AIInteraction Collection

```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project, optional),
  userId: ObjectId (ref: User),
  prompt: String,
  response: String,
  mode: String (enum: explain, generate),
  model: String,
  tokensUsed: {
    input: Number,
    output: Number,
    total: Number
  },
  responseTime: Number,
  contextFiles: [{ filename: String, size: Number }],
  success: Boolean,
  error: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   API Gateway   │    │   Auth Service  │
│                 │    │                 │    │                 │
│ 1. Login Request├────┤ 2. Validate     ├────┤ 3. Authenticate │
│                 │    │    Credentials  │    │    User         │
│ 6. Store Tokens │◄───┤ 5. Return       │◄───┤ 4. Generate     │
│                 │    │    JWT Tokens   │    │    JWT Tokens   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### JWT Token Strategy

- **Access Token**: Short-lived (15 minutes), contains user info
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Token Rotation**: New refresh token issued on each refresh

### Security Layers

1. **Network Security**: HTTPS, CORS, Security Headers
2. **Authentication**: JWT tokens, bcrypt password hashing
3. **Authorization**: Role-based access control (RBAC)
4. **Input Validation**: Request validation, sanitization
5. **Rate Limiting**: Per-user and per-IP limits
6. **Error Handling**: Secure error messages

## AI Integration Architecture

### Hugging Face API Integration with Smart Model Detection

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Request  │    │   AI Service    │    │ Hugging Face API│
│                 │    │                 │    │                 │
│ 1. AI Generate  ├────┤ 2. Detect Model ├────┤ 3. Chat/Text    │
│    Request      │    │    Type & API   │    │    Generation   │
│                 │    │                 │    │                 │
│ 6. Return       │◄───┤ 5. Log          │◄───┤ 4. Generate     │
│    Response     │    │    Interaction  │    │    Response     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Model Type Detection Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Model Name    │    │  Type Detection │    │   API Method    │
│                 │    │                 │    │                 │
│ Qwen-Instruct   ├────┤ isConversational├────┤ chatCompletion  │
│ GPT-2           ├────┤ isTextGen       ├────┤ textGeneration  │
│ Llama-Chat      ├────┤ isConversational├────┤ chatCompletion  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Context Management

- **Project Context**: Include relevant project files
- **Token Management**: Optimize context to fit model limits
- **File Filtering**: Select most relevant files for AI context
- **Model Compatibility**: Automatic API selection based on model type
- **Fallback Strategy**: Multiple model fallbacks for high availability

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: No server-side sessions
- **Database Scaling**: MongoDB sharding and replication
- **Load Balancing**: Multiple server instances
- **Caching**: Redis for session and response caching

### Performance Optimization

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip response compression
- **Rate Limiting**: Prevent abuse and ensure fair usage

## Monitoring & Observability

### Logging Strategy

```javascript
// Request Logging
{
  timestamp: "2024-01-01T00:00:00Z",
  method: "POST",
  url: "/api/projects",
  status: 201,
  duration: "150ms",
  userId: "user-id",
  ip: "192.168.1.1"
}

// Error Logging
{
  timestamp: "2024-01-01T00:00:00Z",
  level: "error",
  message: "Database connection failed",
  stack: "Error stack trace...",
  userId: "user-id",
  requestId: "req-id"
}
```

### Health Checks

- **Application Health**: `/api/health`
- **Database Health**: MongoDB connection status
- **AI Service Health**: `/api/ai/health`
- **External Dependencies**: API connectivity

### Metrics Collection

- **Request Metrics**: Response times, error rates
- **User Metrics**: Active users, feature usage
- **AI Metrics**: Token usage, response times
- **System Metrics**: Memory, CPU, database performance

## Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   App Instances │    │    Database     │
│                 │    │                 │    │                 │
│ • SSL/TLS       ├────┤ • Node.js App   ├────┤ • MongoDB Atlas │
│ • Rate Limiting │    │ • Health Checks │    │ • Replication   │
│ • Failover      │    │ • Auto Scaling  │    │ • Backups       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### CI/CD Pipeline

1. **Code Commit**: Push to repository
2. **Automated Tests**: Run test suite
3. **Build**: Create production build
4. **Deploy**: Deploy to staging/production
5. **Health Check**: Verify deployment
6. **Rollback**: Automatic rollback on failure

## Error Handling Strategy

### Error Classification

- **Operational Errors**: Expected errors (validation, not found)
- **Programming Errors**: Bugs in code (syntax, logic)
- **System Errors**: Infrastructure issues (database down)

### Error Response Format

```javascript
{
  success: false,
  message: "User-friendly error message",
  errors: [
    {
      field: "email",
      message: "Email is required",
      code: "REQUIRED_FIELD"
    }
  ],
  requestId: "req-12345",
  timestamp: "2024-01-01T00:00:00Z"
}
```

## Future Enhancements

### Planned Features

1. **Real-time Collaboration**: WebSocket integration
2. **Caching Layer**: Redis for improved performance
3. **Microservices**: Split into smaller services
4. **Event Sourcing**: Track all system events
5. **GraphQL API**: Alternative to REST API
6. **File Versioning**: Track file changes over time
7. **Advanced Analytics**: User behavior tracking
8. **Multi-tenancy**: Support for organizations

### Scalability Roadmap

1. **Phase 1**: Optimize current architecture
2. **Phase 2**: Implement caching and CDN
3. **Phase 3**: Microservices architecture
4. **Phase 4**: Event-driven architecture
5. **Phase 5**: Global distribution

## Best Practices

### Code Quality

- **ESLint**: Code linting and formatting
- **Testing**: Unit and integration tests
- **Documentation**: Comprehensive API docs
- **Code Reviews**: Peer review process

### Security Best Practices

- **Input Validation**: Validate all inputs
- **Output Encoding**: Prevent XSS attacks
- **SQL Injection**: Use parameterized queries
- **Authentication**: Strong password policies
- **Authorization**: Principle of least privilege
- **Logging**: Log security events
- **Updates**: Keep dependencies updated

### Performance Best Practices

- **Database Optimization**: Proper indexing
- **Caching**: Cache frequently accessed data
- **Compression**: Compress responses
- **Minification**: Minimize payload sizes
- **CDN**: Use content delivery networks
- **Monitoring**: Track performance metrics

---

This architecture provides a solid foundation for the DevAssist backend while maintaining flexibility for future enhancements and scaling requirements.
