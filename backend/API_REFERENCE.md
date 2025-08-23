# DevAssist API Reference

> **Complete API endpoint reference for frontend developers**

## 📋 Table of Contents

- [Base Configuration](#base-configuration)
- [Authentication Endpoints](#authentication-endpoints)
- [Project Endpoints](#project-endpoints)
- [File Management Endpoints](#file-management-endpoints)
- [AI Integration Endpoints](#ai-integration-endpoints)
- [Utility Endpoints](#utility-endpoints)
- [Response Formats](#response-formats)
- [Error Codes](#error-codes)

## 🔧 Base Configuration

### API Base URLs

- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-app.render.com/api`

### Required Headers

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <access-token>' // For protected endpoints
}
```

## 🔐 Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "username": "string (3-30 chars, alphanumeric + _ -)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, 1 upper, 1 lower, 1 number)",
  "role": "string (optional: developer|admin|sme, default: developer)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    },
    "tokens": {
      "accessToken": "string (JWT)",
      "refreshToken": "string (JWT)",
      "expiresIn": "string (15m)"
    }
  }
}
```

### POST `/auth/login`

Authenticate user and get tokens.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      /* User object */
    },
    "tokens": {
      /* Token object */
    }
  }
}
```

### POST `/auth/refresh`

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      /* User object */
    },
    "tokens": {
      /* New token object */
    }
  }
}
```

### GET `/auth/me` 🔒

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "lastLogin": "ISO date",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

### PUT `/auth/me` 🔒

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "username": "string (optional)",
  "email": "string (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    /* Updated user object */
  }
}
```

### PUT `/auth/change-password` 🔒

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

### POST `/auth/logout` 🔒

Logout user (invalidate refresh token).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/auth/logout-all` 🔒

Logout from all devices (clear all refresh tokens).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

### DELETE `/auth/me` 🔒

Deactivate user account.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

## 📁 Project Endpoints

### GET `/projects` 🔒

Get user's projects with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `sort` (string, optional): Sort field (`createdAt`, `-createdAt`, `name`, `-name`, `lastActivity`, `-lastActivity`)
- `q` (string, optional): Search query (1-100 chars)
- `language` (string, optional): Filter by language (`javascript`, `typescript`, `python`, `java`, `cpp`, `html`, `css`, `other`)
- `tags` (string, optional): Filter by tags (comma-separated)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "owner": {
          "_id": "string",
          "username": "string",
          "email": "string"
        },
        "language": "string",
        "tags": ["string"],
        "isPublic": "boolean",
        "lastActivity": "ISO date",
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

### POST `/projects` 🔒

Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "string (1-100 chars)",
  "description": "string (optional, max 500 chars)",
  "language": "string (optional, default: javascript)",
  "tags": ["string"] (optional, max 30 chars each),
  "isPublic": "boolean (optional, default: false)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    /* Project object with populated owner */
  }
}
```

### GET `/projects/public`

Get public projects (no authentication required).

**Query Parameters:** Same as `/projects`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projects": [
      /* Array of public projects */
    ],
    "pagination": {
      /* Pagination object */
    }
  }
}
```

### GET `/projects/stats` 🔒

Get user project statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalProjects": "number",
    "publicProjects": "number",
    "privateProjects": "number",
    "totalFiles": "number",
    "avgFilesPerProject": "number",
    "languageBreakdown": {
      "javascript": "number",
      "python": "number"
      // ... other languages
    }
  }
}
```

### GET `/projects/search` 🔒

Search projects across user's projects and public projects.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `q` (string, required): Search query (1-100 chars)
- `page`, `limit`, `sort`, `language`, `tags`: Same as `/projects`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projects": [
      /* Array of matching projects */
    ],
    "pagination": {
      /* Pagination object */
    }
  }
}
```

### GET `/projects/:id` 🔒

Get project details by ID.

**Headers:** `Authorization: Bearer <token>` (optional for public projects)

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* Complete project object with files */
  }
}
```

### PUT `/projects/:id` 🔒

Update project (owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "language": "string (optional)",
  "tags": ["string"] (optional),
  "isPublic": "boolean (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    /* Updated project object */
  }
}
```

### DELETE `/projects/:id` 🔒

Delete project (owner only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## 📄 File Management Endpoints

### GET `/projects/:projectId/files`

Get all files in a project.

**Headers:** `Authorization: Bearer <token>` (optional for public projects)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "string",
    "projectName": "string",
    "owner": {
      /* Owner object */
    },
    "files": [
      {
        "_id": "string",
        "filename": "string",
        "size": "number (bytes)",
        "mimeType": "string",
        "lastModified": "ISO date",
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "totalFiles": "number",
    "totalSize": "number (bytes)"
  }
}
```

### POST `/projects/:projectId/files` 🔒

Create a new file in project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "filename": "string (1-255 chars, no invalid chars)",
  "content": "string (max 200KB)",
  "mimeType": "string (optional, default: text/plain)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "File created successfully",
  "data": {
    /* File object with content */
  }
}
```

### GET `/projects/:projectId/files/:filename`

Get file metadata.

**Headers:** `Authorization: Bearer <token>` (optional for public projects)

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* File object without content */
  }
}
```

### GET `/projects/:projectId/files/:filename/content`

Get file content.

**Headers:** `Authorization: Bearer <token>` (optional for public projects)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "filename": "string",
    "content": "string",
    "mimeType": "string",
    "size": "number",
    "lastModified": "ISO date"
  }
}
```

### PUT `/projects/:projectId/files/:filename` 🔒

Update existing file.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content": "string (max 200KB)",
  "mimeType": "string (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    /* Updated file object */
  }
}
```

### DELETE `/projects/:projectId/files/:filename` 🔒

Delete file from project.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### PATCH `/projects/:projectId/files/:filename/rename` 🔒

Rename file in project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "newFilename": "string (1-255 chars, no invalid chars)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "File renamed successfully",
  "data": {
    /* Renamed file object */
  }
}
```

### POST `/projects/:projectId/files/:filename/copy` 🔒

Copy file within project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "targetFilename": "string (1-255 chars, no invalid chars)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "File copied successfully",
  "data": {
    /* Copied file object */
  }
}
```

### GET `/projects/:projectId/files/search`

Search files within project.

**Headers:** `Authorization: Bearer <token>` (optional for public projects)

**Query Parameters:**

- `q` (string, required): Search query

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "string",
    "projectName": "string",
    "searchQuery": "string",
    "results": [
      {
        "_id": "string",
        "filename": "string",
        "size": "number",
        "mimeType": "string",
        "lastModified": "ISO date",
        "snippet": "string (content snippet with search term)"
      }
    ],
    "totalMatches": "number"
  }
}
```

## 🤖 AI Integration Endpoints

### GET `/ai/health`

Check AI service health (no authentication required).

**Response (200):**

```json
{
  "success": true,
  "message": "AI service is healthy",
  "data": {
    "model": "string",
    "maxTokens": "number",
    "provider": "Hugging Face",
    "timestamp": "ISO date"
  }
}
```

### POST `/ai/generate` 🔒

Generate AI response for code generation or explanation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "prompt": "string (1-10000 chars)",
  "mode": "string (explain|generate)",
  "projectId": "string (optional, MongoDB ObjectId)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "string (AI generated content)",
    "mode": "string",
    "model": "string",
    "tokensUsed": {
      "input": "number",
      "output": "number",
      "total": "number"
    },
    "responseTime": "number (milliseconds)",
    "contextFiles": [
      {
        "filename": "string",
        "size": "number"
      }
    ],
    "interactionId": "string"
  }
}
```

### GET `/ai/history` 🔒

Get user's AI interaction history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `projectId` (string, optional): Filter by project ID
- `mode` (string, optional): Filter by mode (`explain|generate`)
- `days` (number, optional): Filter by days (1-365, default: 30)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "interactions": [
      {
        "_id": "string",
        "projectId": {
          "_id": "string",
          "name": "string"
        },
        "prompt": "string",
        "mode": "string",
        "model": "string",
        "tokensUsed": {
          /* Token usage object */
        },
        "responseTime": "number",
        "success": "boolean",
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      /* Pagination object */
    }
  }
}
```

### GET `/ai/stats` 🔒

Get user's AI usage statistics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `days` (number, optional): Period in days (1-365, default: 30)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalInteractions": "number",
    "totalTokensUsed": "number",
    "avgResponseTime": "number",
    "successRate": "number (0-1)",
    "modeBreakdown": ["string"],
    "period": "string"
  }
}
```

### GET `/ai/token-usage` 🔒

Get user's token usage and limits.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "role": "developer",
    "daily": {
      "limit": 10000,
      "used": 2500,
      "remaining": 7500,
      "requests": 15
    },
    "monthly": {
      "used": 45000,
      "requests": 250
    },
    "total": {
      "tokensUsed": 150000,
      "requests": 1000
    },
    "resetTime": {
      "daily": "Midnight UTC",
      "nextReset": "2024-01-16T00:00:00.000Z"
    }
  }
}
```

### GET `/ai/can-request` 🔒

Check if user can make AI requests.

**Headers:** `Authorization: Bearer <token>`

**Response (200) - Can Make Request:**

```json
{
  "success": true,
  "data": {
    "canMakeRequest": true,
    "dailyLimit": 10000,
    "tokensUsed": 2500,
    "tokensRemaining": 7500,
    "limitExceeded": false,
    "message": "You have 7500 tokens remaining today."
  }
}
```

**Response (429) - Limit Exceeded:**

```json
{
  "success": false,
  "message": "Daily token limit exceeded",
  "error": {
    "code": "TOKEN_LIMIT_EXCEEDED",
    "dailyLimit": 10000,
    "tokensUsed": 10000,
    "resetTime": "Midnight UTC",
    "nextReset": "2024-01-16T00:00:00.000Z"
  }
}
```

### GET `/ai/interactions/:id` 🔒

Get specific AI interaction by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "string",
    "projectId": {
      /* Project object or null */
    },
    "userId": "string",
    "prompt": "string",
    "response": "string",
    "mode": "string",
    "model": "string",
    "tokensUsed": {
      /* Token usage object */
    },
    "responseTime": "number",
    "contextFiles": [
      /* Context files array */
    ],
    "success": "boolean",
    "error": "string or null",
    "metadata": {
      /* Request metadata */
    },
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

### DELETE `/ai/interactions/:id` 🔒

Delete AI interaction.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Interaction deleted successfully"
}
```

### GET `/ai/projects/:projectId/history` 🔒

Get AI interaction history for specific project.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `limit` (number, optional): Max items (1-100, default: 50)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "string",
    "interactions": [
      /* Array of interactions without full response */
    ],
    "total": "number"
  }
}
```

## 🔧 Utility Endpoints

### GET `/health`

API health check (no authentication required).

**Response (200):**

```json
{
  "success": true,
  "message": "DevAssist API is running",
  "data": {
    "service": "string",
    "version": "string",
    "environment": "string",
    "timestamp": "ISO date",
    "uptime": "number (seconds)"
  }
}
```

### GET `/version`

API version information (no authentication required).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "version": "string",
    "apiVersion": "string",
    "features": ["string"],
    "supportedLanguages": ["string"]
  }
}
```

### GET `/docs`

API documentation (no authentication required).

**Response (200):**

```json
{
  "success": true,
  "message": "DevAssist API Documentation",
  "data": {
    "baseUrl": "string",
    "endpoints": {
      /* Endpoint descriptions */
    },
    "authentication": {
      /* Auth info */
    },
    "rateLimit": {
      /* Rate limit info */
    },
    "fileConstraints": {
      /* File constraints */
    }
  }
}
```

## 📋 Response Formats

### Success Response

```json
{
  "success": true,
  "message": "string (optional)",
  "data": {} // Response data
}
```

### Error Response

```json
{
  "success": false,
  "message": "string (error description)",
  "errors": [
    // Optional validation errors
    {
      "field": "string",
      "message": "string",
      "value": "any"
    }
  ]
}
```

### Pagination Object

```json
{
  "page": "number (current page)",
  "limit": "number (items per page)",
  "total": "number (total items)",
  "pages": "number (total pages)"
}
```

## ❌ Error Codes

| Code | Description           | Common Causes                         |
| ---- | --------------------- | ------------------------------------- |
| 400  | Bad Request           | Invalid input, validation errors      |
| 401  | Unauthorized          | Missing/invalid token, expired token  |
| 403  | Forbidden             | Insufficient permissions              |
| 404  | Not Found             | Resource doesn't exist                |
| 409  | Conflict              | Duplicate email/username, file exists |
| 422  | Unprocessable Entity  | Invalid data format                   |
| 429  | Too Many Requests     | Rate limit exceeded                   |
| 500  | Internal Server Error | Server error                          |

## 🔐 Authentication Notes

- **🔒** indicates protected endpoints requiring authentication
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Use `/auth/refresh` to get new access tokens
- Include `Authorization: Bearer <token>` header for protected endpoints

## 📊 Rate Limits

| Endpoint Type    | Limit        | Window     |
| ---------------- | ------------ | ---------- |
| General API      | 100 requests | 15 minutes |
| Authentication   | 10 requests  | 15 minutes |
| AI Generation    | 100 requests | 1 hour\*   |
| File Operations  | 50 requests  | 10 minutes |
| Project Creation | 20 requests  | 1 hour     |

\*AI limits vary by user role: Developer (100), SME (200), Admin (1000)

## 📝 File Constraints

- **Maximum file size**: 200KB (204,800 bytes)
- **Maximum files per project**: 100
- **Supported file types**: Text-based files
- **Invalid filename characters**: `< > : " / \ | ? * \x00-\x1f`

## 🌐 CORS

The API supports CORS for the following origins:

- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue default)
- Custom origins configured in production

---

**For more examples and integration guides, see [FRONTEND_API_GUIDE.md](./FRONTEND_API_GUIDE.md)**
