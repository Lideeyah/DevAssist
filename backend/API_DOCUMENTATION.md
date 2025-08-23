# DevAssist API Documentation

## Overview

The DevAssist API provides a comprehensive backend for an AI-powered web IDE designed for African developers, teams, and SMEs. This RESTful API supports user management, project collaboration, file operations, and AI-powered code assistance.

## Base URL

```
Production: https://your-app.render.com/api
Development: http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

- **Access Token**: Expires in 95 minutes
- **Refresh Token**: Expires in 7 days
- Use `/auth/refresh` to get new access tokens

## Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {}, // Response data (if applicable)
  "errors": [] // Validation errors (if applicable)
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

Rate limits are applied per user (authenticated) or IP address (unauthenticated):

| Endpoint Type    | Limit        | Window     |
| ---------------- | ------------ | ---------- |
| General API      | 100 requests | 15 minutes |
| Authentication   | 10 requests  | 15 minutes |
| AI Generation    | 100 requests | 1 hour     |
| File Operations  | 50 requests  | 10 minutes |
| Project Creation | 20 requests  | 1 hour     |

Rate limit headers are included in responses:

- `RateLimit-Limit`: Request limit
- `RateLimit-Remaining`: Remaining requests
- `RateLimit-Reset`: Reset time

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "developer1",
  "email": "dev@example.com",
  "password": "SecurePass123",
  "role": "developer" // optional: developer, admin, sme
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user-id",
      "username": "developer1",
      "email": "dev@example.com",
      "role": "developer"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": "15m"
    }
  }
}
```

#### Login User

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "dev@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### Get Profile

```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /auth/me
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### Change Password

```http
PUT /auth/change-password
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

### Projects

#### Get User Projects

```http
GET /projects?page=1&limit=10&sort=-createdAt&q=search&language=javascript
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sort` (optional): Sort field (createdAt, -createdAt, name, -name)
- `q` (optional): Search query
- `language` (optional): Filter by language
- `tags` (optional): Filter by tags (comma-separated)

#### Create Project

```http
POST /projects
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "My Web App",
  "description": "A sample web application",
  "language": "javascript",
  "tags": ["web", "frontend"],
  "isPublic": false
}
```

#### Get Project

```http
GET /projects/:id
Authorization: Bearer <token> (optional for public projects)
```

#### Update Project

```http
PUT /projects/:id
Authorization: Bearer <token>
```

#### Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <token>
```

#### Get Public Projects

```http
GET /projects/public?page=1&limit=10
```

#### Search Projects

```http
GET /projects/search?q=react&language=javascript
Authorization: Bearer <token>
```

#### Get Project Statistics

```http
GET /projects/stats
Authorization: Bearer <token>
```

### Files

#### Get Project Files

```http
GET /projects/:projectId/files
Authorization: Bearer <token> (optional for public projects)
```

#### Create/Update File

```http
POST /projects/:projectId/files
PUT /projects/:projectId/files/:filename
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "filename": "app.js",
  "content": "console.log('Hello World');",
  "mimeType": "text/javascript"
}
```

#### Get File

```http
GET /projects/:projectId/files/:filename
Authorization: Bearer <token> (optional for public projects)
```

#### Get File Content

```http
GET /projects/:projectId/files/:filename/content
Authorization: Bearer <token> (optional for public projects)
```

#### Delete File

```http
DELETE /projects/:projectId/files/:filename
Authorization: Bearer <token>
```

#### Rename File

```http
PATCH /projects/:projectId/files/:filename/rename
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "newFilename": "newname.js"
}
```

#### Copy File

```http
POST /projects/:projectId/files/:filename/copy
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "targetFilename": "copy-of-file.js"
}
```

#### Search Files

```http
GET /projects/:projectId/files/search?q=function
Authorization: Bearer <token> (optional for public projects)
```

### AI Integration

#### Generate AI Response

```http
POST /ai/generate
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "prompt": "Create a React component for a login form",
  "mode": "generate", // "generate" or "explain"
  "projectId": "project-id" // optional
}
```

**Note**: DevAssist automatically detects whether to use conversational models (chat completion) or text generation models based on the configured model type.

**Response:**

```json
{
  "success": true,
  "data": {
    "response": "// Generated code here",
    "mode": "generate",
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "tokensUsed": {
      "input": 150,
      "output": 300,
      "total": 450
    },
    "responseTime": 2500,
    "contextFiles": [{ "filename": "app.js", "size": 1024 }],
    "interactionId": "interaction-id"
  }
}
```

#### Get Interaction History

```http
GET /ai/history?page=1&limit=20&projectId=project-id&mode=generate&days=30
Authorization: Bearer <token>
```

#### Get AI Usage Statistics

```http
GET /ai/stats?days=30
Authorization: Bearer <token>
```

#### Get Specific Interaction

```http
GET /ai/interactions/:id
Authorization: Bearer <token>
```

#### Delete Interaction

```http
DELETE /ai/interactions/:id
Authorization: Bearer <token>
```

#### Get Project AI History

```http
GET /ai/projects/:projectId/history?limit=50
Authorization: Bearer <token>
```

### Utility Endpoints

#### Health Check

```http
GET /health
```

#### API Version

```http
GET /version
```

#### AI Service Health

```http
GET /ai/health
```

## File Constraints

- **Maximum file size**: 200KB
- **Maximum files per project**: 100
- **Supported file types**: Text-based files (code, markdown, JSON, etc.)

## User Roles

- **developer**: Standard user with full project access
- **admin**: Administrative privileges, can manage all users and projects
- **sme**: Small/Medium Enterprise user with enhanced AI limits

## Pagination

Paginated endpoints return:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Error Handling

Validation errors include detailed field information:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## SDKs and Examples

### JavaScript/Node.js Example

```javascript
const API_BASE = "http://localhost:5000/api";
let accessToken = "";

// Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    accessToken = data.data.tokens.accessToken;
  }
  return data;
};

// Create project
const createProject = async (projectData) => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(projectData),
  });

  return await response.json();
};

// Generate AI code
const generateCode = async (prompt, projectId) => {
  const response = await fetch(`${API_BASE}/ai/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      prompt,
      mode: "generate",
      projectId,
    }),
  });

  return await response.json();
};
```

