# DevAssist Frontend API Integration Guide

> **Complete API reference for frontend developers integrating with DevAssist backend**

## 🚀 Quick Start

### Base Configuration

```javascript
const API_CONFIG = {
  baseURL: "http://localhost:5001/api", // Development
  // baseURL: 'https://your-app.render.com/api', // Production
  timeout: 15000, // Increased for AI requests
  headers: {
    "Content-Type": "application/json",
  },
};
```

### Authentication Setup

```javascript
class DevAssistAPI {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  // Set authorization header
  getHeaders(includeAuth = true) {
    const headers = { ...API_CONFIG.headers };
    if (includeAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  // Make authenticated request
  async request(method, endpoint, data = null, includeAuth = true) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(includeAuth),
    };

    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      // Handle token expiration
      if (response.status === 401 && result.message?.includes("expired")) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry original request
          return this.request(method, endpoint, data, includeAuth);
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        error: error.message,
      };
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        this.setTokens(result.data.tokens);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    // Refresh failed, clear tokens
    this.clearTokens();
    return false;
  }

  // Store tokens
  setTokens(tokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

// Initialize API client
const api = new DevAssistAPI();
```

## 🔐 Authentication API

### Register User

```javascript
async function registerUser(userData) {
  const response = await api.request(
    "POST",
    "/auth/register",
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "developer", // optional: developer, admin, sme
    },
    false
  ); // No auth required

  if (response.success) {
    // Store tokens
    api.setTokens(response.data.data.tokens);
    return response.data.data.user;
  }

  throw new Error(response.data.message || "Registration failed");
}

// Usage
try {
  const user = await registerUser({
    username: "johndoe",
    email: "john@example.com",
    password: "SecurePass123",
  });
  console.log("User registered:", user);
} catch (error) {
  console.error("Registration error:", error.message);
}
```

### Login User

```javascript
async function loginUser(email, password) {
  const response = await api.request(
    "POST",
    "/auth/login",
    {
      email,
      password,
    },
    false
  ); // No auth required

  if (response.success) {
    // Store tokens
    api.setTokens(response.data.data.tokens);
    return response.data.data.user;
  }

  throw new Error(response.data.message || "Login failed");
}

// Usage
try {
  const user = await loginUser("john@example.com", "SecurePass123");
  console.log("User logged in:", user);
} catch (error) {
  console.error("Login error:", error.message);
}
```

### Get User Profile

```javascript
async function getUserProfile() {
  const response = await api.request("GET", "/auth/me");

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get profile");
}

// Usage
try {
  const profile = await getUserProfile();
  console.log("User profile:", profile);
} catch (error) {
  console.error("Profile error:", error.message);
}
```

### Update Profile

```javascript
async function updateProfile(updates) {
  const response = await api.request("PUT", "/auth/me", updates);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to update profile");
}

// Usage
try {
  const updatedUser = await updateProfile({
    username: "newusername",
    email: "newemail@example.com",
  });
  console.log("Profile updated:", updatedUser);
} catch (error) {
  console.error("Update error:", error.message);
}
```

### Change Password

```javascript
async function changePassword(currentPassword, newPassword) {
  const response = await api.request("PUT", "/auth/change-password", {
    currentPassword,
    newPassword,
  });

  if (response.success) {
    return response.data.message;
  }

  throw new Error(response.data.message || "Failed to change password");
}
```

### Logout

```javascript
async function logout() {
  const response = await api.request("POST", "/auth/logout", {
    refreshToken: api.refreshToken,
  });

  // Clear tokens regardless of response
  api.clearTokens();

  return response.success;
}
```

## 📁 Project Management API

### Get User Projects

```javascript
async function getProjects(options = {}) {
  const params = new URLSearchParams();

  // Add query parameters
  if (options.page) params.append("page", options.page);
  if (options.limit) params.append("limit", options.limit);
  if (options.search) params.append("q", options.search);
  if (options.language) params.append("language", options.language);
  if (options.tags) params.append("tags", options.tags.join(","));
  if (options.sort) params.append("sort", options.sort);

  const endpoint = `/projects${
    params.toString() ? "?" + params.toString() : ""
  }`;
  const response = await api.request("GET", endpoint);

  if (response.success) {
    return {
      projects: response.data.data.projects,
      pagination: response.data.data.pagination,
    };
  }

  throw new Error(response.data.message || "Failed to get projects");
}

// Usage
try {
  const result = await getProjects({
    page: 1,
    limit: 10,
    search: "react",
    language: "javascript",
    sort: "-createdAt",
  });

  console.log("Projects:", result.projects);
  console.log("Pagination:", result.pagination);
} catch (error) {
  console.error("Projects error:", error.message);
}
```

### Create Project

```javascript
async function createProject(projectData) {
  const response = await api.request("POST", "/projects", {
    name: projectData.name,
    description: projectData.description || "",
    language: projectData.language || "javascript",
    tags: projectData.tags || [],
    isPublic: projectData.isPublic || false,
  });

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to create project");
}

// Usage
try {
  const project = await createProject({
    name: "My React App",
    description: "A modern React application",
    language: "javascript",
    tags: ["react", "frontend"],
    isPublic: false,
  });
  console.log("Project created:", project);
} catch (error) {
  console.error("Create project error:", error.message);
}
```

### Get Project Details

```javascript
async function getProject(projectId) {
  const response = await api.request("GET", `/projects/${projectId}`);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get project");
}
```

### Update Project

```javascript
async function updateProject(projectId, updates) {
  const response = await api.request("PUT", `/projects/${projectId}`, updates);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to update project");
}
```

### Delete Project

```javascript
async function deleteProject(projectId) {
  const response = await api.request("DELETE", `/projects/${projectId}`);

  if (response.success) {
    return true;
  }

  throw new Error(response.data.message || "Failed to delete project");
}
```

### Get Public Projects

```javascript
async function getPublicProjects(options = {}) {
  const params = new URLSearchParams();

  if (options.page) params.append("page", options.page);
  if (options.limit) params.append("limit", options.limit);
  if (options.search) params.append("q", options.search);
  if (options.language) params.append("language", options.language);

  const endpoint = `/projects/public${
    params.toString() ? "?" + params.toString() : ""
  }`;
  const response = await api.request("GET", endpoint, null, false); // No auth required

  if (response.success) {
    return {
      projects: response.data.data.projects,
      pagination: response.data.data.pagination,
    };
  }

  throw new Error(response.data.message || "Failed to get public projects");
}
```

## 📄 File Management API

### Get Project Files

```javascript
async function getProjectFiles(projectId) {
  const response = await api.request("GET", `/projects/${projectId}/files`);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get files");
}

// Usage
try {
  const filesData = await getProjectFiles("project-id-here");
  console.log("Files:", filesData.files);
  console.log("Total size:", filesData.totalSize);
} catch (error) {
  console.error("Get files error:", error.message);
}
```

### Create/Update File

```javascript
async function saveFile(projectId, fileData) {
  const endpoint = `/projects/${projectId}/files`;
  const response = await api.request("POST", endpoint, {
    filename: fileData.filename,
    content: fileData.content,
    mimeType: fileData.mimeType || "text/plain",
  });

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to save file");
}

// Usage
try {
  const file = await saveFile("project-id", {
    filename: "app.js",
    content: 'console.log("Hello World!");',
    mimeType: "text/javascript",
  });
  console.log("File saved:", file);
} catch (error) {
  console.error("Save file error:", error.message);
}
```

### Get File Content

```javascript
async function getFileContent(projectId, filename) {
  const response = await api.request(
    "GET",
    `/projects/${projectId}/files/${encodeURIComponent(filename)}/content`
  );

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get file content");
}
```

### Delete File

```javascript
async function deleteFile(projectId, filename) {
  const response = await api.request(
    "DELETE",
    `/projects/${projectId}/files/${encodeURIComponent(filename)}`
  );

  if (response.success) {
    return true;
  }

  throw new Error(response.data.message || "Failed to delete file");
}
```

### Rename File

```javascript
async function renameFile(projectId, oldFilename, newFilename) {
  const response = await api.request(
    "PATCH",
    `/projects/${projectId}/files/${encodeURIComponent(oldFilename)}/rename`,
    {
      newFilename,
    }
  );

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to rename file");
}
```

### Copy File

```javascript
async function copyFile(projectId, sourceFilename, targetFilename) {
  const response = await api.request(
    "POST",
    `/projects/${projectId}/files/${encodeURIComponent(sourceFilename)}/copy`,
    {
      targetFilename,
    }
  );

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to copy file");
}
```

## 🤖 AI Integration API

### Check Token Usage and Limits

```javascript
async function getTokenUsage() {
  const response = await api.request("GET", "/ai/token-usage");

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get token usage");
}

// Usage
try {
  const usage = await getTokenUsage();
  console.log("Daily limit:", usage.daily.limit);
  console.log("Tokens used:", usage.daily.used);
  console.log("Tokens remaining:", usage.daily.remaining);
  console.log(
    "Usage percentage:",
    ((usage.daily.used / usage.daily.limit) * 100).toFixed(1) + "%"
  );
} catch (error) {
  console.error("Token usage error:", error.message);
}
```

### Check if User Can Make AI Request

```javascript
async function canMakeAIRequest() {
  const response = await api.request("GET", "/ai/can-request");

  if (response.success) {
    return response.data.data;
  }

  throw new Error(
    response.data.message || "Failed to check request capability"
  );
}

// Usage
try {
  const canRequest = await canMakeAIRequest();
  if (canRequest.canMakeRequest) {
    console.log("✅ Can make AI request");
    console.log("Tokens remaining:", canRequest.tokensRemaining);
  } else {
    console.log("❌ Cannot make AI request");
    console.log("Reason:", canRequest.message);
  }
} catch (error) {
  console.error("Request check error:", error.message);
}
```

### Generate AI Response

```javascript
async function generateAIResponse(prompt, mode = "generate", projectId = null) {
  const response = await api.request("POST", "/ai/generate", {
    prompt,
    mode, // 'generate' or 'explain'
    projectId, // optional: include project context
  });

  if (response.success) {
    return {
      response: response.data.data.response,
      mode: response.data.data.mode,
      model: response.data.data.model,
      tokensUsed: response.data.data.tokensUsed,
      responseTime: response.data.data.responseTime,
      contextFiles: response.data.data.contextFiles,
      interactionId: response.data.data.interactionId,
    };
  }

  throw new Error(response.data.message || "Failed to generate AI response");
}

// Usage Examples

// Generate code without project context
try {
  const result = await generateAIResponse(
    "Create a React component for a login form",
    "generate"
  );
  console.log("Generated code:", result.response);
  console.log("Model used:", result.model);
  console.log("Response time:", result.responseTime + "ms");
} catch (error) {
  if (error.message.includes("token limit")) {
    console.error("❌ Token limit exceeded:", error.message);
    // Check token usage and show user their limits
    const usage = await getTokenUsage();
    console.log(`Daily limit: ${usage.daily.limit}, Used: ${usage.daily.used}`);
  } else {
    console.error("AI generation error:", error.message);
  }
}

// Explain code with project context
try {
  const result = await generateAIResponse(
    "Explain how this authentication system works",
    "explain",
    "project-id-here"
  );
  console.log("Explanation:", result.response);
  console.log("Context files used:", result.contextFiles);
  console.log("Model used:", result.model);
} catch (error) {
  if (error.message.includes("token limit")) {
    console.error("❌ Token limit exceeded:", error.message);
    // Suggest shorter prompt or waiting
    console.log(
      "💡 Try a shorter prompt or wait until tomorrow for limit reset"
    );
  } else {
    console.error("AI explanation error:", error.message);
  }
}
```

### Get AI Interaction History

```javascript
async function getAIHistory(options = {}) {
  const params = new URLSearchParams();

  if (options.page) params.append("page", options.page);
  if (options.limit) params.append("limit", options.limit);
  if (options.projectId) params.append("projectId", options.projectId);
  if (options.mode) params.append("mode", options.mode);
  if (options.days) params.append("days", options.days);

  const endpoint = `/ai/history${
    params.toString() ? "?" + params.toString() : ""
  }`;
  const response = await api.request("GET", endpoint);

  if (response.success) {
    return {
      interactions: response.data.data.interactions,
      pagination: response.data.data.pagination,
    };
  }

  throw new Error(response.data.message || "Failed to get AI history");
}
```

### Get AI Usage Statistics

```javascript
async function getAIStats(days = 30) {
  const response = await api.request("GET", `/ai/stats?days=${days}`);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to get AI stats");
}

// Usage
try {
  const stats = await getAIStats(30);
  console.log("Total interactions:", stats.totalInteractions);
  console.log("Tokens used:", stats.totalTokensUsed);
  console.log("Average response time:", stats.avgResponseTime);
  console.log("Success rate:", stats.successRate);
} catch (error) {
  console.error("AI stats error:", error.message);
}
```

## 🔍 Search & Filtering

### Search Projects

```javascript
async function searchProjects(query, options = {}) {
  const params = new URLSearchParams();
  params.append("q", query);

  if (options.page) params.append("page", options.page);
  if (options.limit) params.append("limit", options.limit);
  if (options.language) params.append("language", options.language);
  if (options.tags) params.append("tags", options.tags.join(","));

  const endpoint = `/projects/search?${params.toString()}`;
  const response = await api.request("GET", endpoint);

  if (response.success) {
    return {
      projects: response.data.data.projects,
      pagination: response.data.data.pagination,
    };
  }

  throw new Error(response.data.message || "Failed to search projects");
}
```

### Search Files in Project

```javascript
async function searchFiles(projectId, query) {
  const params = new URLSearchParams();
  params.append("q", query);

  const endpoint = `/projects/${projectId}/files/search?${params.toString()}`;
  const response = await api.request("GET", endpoint);

  if (response.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to search files");
}

// Usage
try {
  const results = await searchFiles("project-id", "function");
  console.log("Search results:", results.results);
  console.log("Total matches:", results.totalMatches);
} catch (error) {
  console.error("File search error:", error.message);
}
```

## 📊 Error Handling

### Standard Error Response Format

```javascript
{
  success: false,
  message: "User-friendly error message",
  errors: [
    {
      field: "email",
      message: "Email is required",
      value: "invalid-value"
    }
  ]
}
```

### Error Handling Utility

```javascript
function handleAPIError(response) {
  if (response.success) return response.data;

  // Handle validation errors
  if (response.data.errors && Array.isArray(response.data.errors)) {
    const fieldErrors = {};
    response.data.errors.forEach((error) => {
      fieldErrors[error.field] = error.message;
    });
    throw new ValidationError(response.data.message, fieldErrors);
  }

  // Handle specific error types
  switch (response.status) {
    case 401:
      throw new AuthenticationError(response.data.message);
    case 403:
      throw new AuthorizationError(response.data.message);
    case 404:
      throw new NotFoundError(response.data.message);
    case 409:
      throw new ConflictError(response.data.message);
    case 429:
      throw new RateLimitError(response.data.message);
    default:
      throw new APIError(response.data.message || "An error occurred");
  }
}

// Custom error classes
class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
}

class ValidationError extends APIError {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

class AuthenticationError extends APIError {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class AuthorizationError extends APIError {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
  }
}

class NotFoundError extends APIError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ConflictError extends APIError {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

class RateLimitError extends APIError {
  constructor(message) {
    super(message);
    this.name = "RateLimitError";
  }
}
```

## 🔄 Real-time Features (Future)

### WebSocket Connection (Planned)

```javascript
class DevAssistWebSocket {
  constructor(projectId) {
    this.projectId = projectId;
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const token = localStorage.getItem("accessToken");
    this.socket = new WebSocket(
      `ws://localhost:5001/ws?token=${token}&project=${this.projectId}`
    );

    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      // Implement reconnection logic
    };
  }

  handleMessage(data) {
    const listeners = this.listeners.get(data.type) || [];
    listeners.forEach((callback) => callback(data.payload));
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  emit(eventType, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: eventType, payload }));
    }
  }
}

// Usage (when implemented)
const ws = new DevAssistWebSocket("project-id");
ws.connect();

ws.on("file-changed", (data) => {
  console.log("File changed:", data);
  // Update UI
});

ws.on("user-joined", (data) => {
  console.log("User joined:", data);
  // Show user in collaboration panel
});
```

## 🎯 React Integration Example

### Custom Hook for API

```javascript
import { useState, useEffect, useCallback } from "react";

// Custom hook for API calls
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { loading, error, callAPI };
}

// Custom hook for projects
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const { loading, error, callAPI } = useAPI();

  const loadProjects = useCallback(
    async (options = {}) => {
      const result = await callAPI(getProjects, options);
      setProjects(result.projects);
      return result;
    },
    [callAPI]
  );

  const createNewProject = useCallback(
    async (projectData) => {
      const project = await callAPI(createProject, projectData);
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    [callAPI]
  );

  const updateExistingProject = useCallback(
    async (projectId, updates) => {
      const updatedProject = await callAPI(updateProject, projectId, updates);
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      return updatedProject;
    },
    [callAPI]
  );

  const removeProject = useCallback(
    async (projectId) => {
      await callAPI(deleteProject, projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    },
    [callAPI]
  );

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject: createNewProject,
    updateProject: updateExistingProject,
    deleteProject: removeProject,
  };
}

// Usage in React component
function ProjectList() {
  const { projects, loading, error, loadProjects, createProject } =
    useProjects();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      // Project automatically added to list
    } catch (error) {
      console.error("Failed to create project:", error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project._id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Token Limits & Usage Management

### Daily Token Limits by Role

- **Developer**: 10,000 tokens per day
- **SME**: 25,000 tokens per day
- **Admin**: 100,000 tokens per day

### Token Usage Tracking

```javascript
// Check current usage
const usage = await getTokenUsage();
console.log(`Used: ${usage.daily.used}/${usage.daily.limit} tokens`);
console.log(`Remaining: ${usage.daily.remaining} tokens`);
console.log(
  `Usage: ${((usage.daily.used / usage.daily.limit) * 100).toFixed(1)}%`
);

// Check if you can make a request
const canRequest = await canMakeAIRequest();
if (!canRequest.canMakeRequest) {
  console.log("❌ Daily limit exceeded");
  console.log("Limit resets at midnight UTC");
}
```

### Token Limit Error Handling

```javascript
try {
  const result = await generateAIResponse(prompt, mode, projectId);
  // Success - update UI with result
} catch (error) {
  if (error.message.includes("token limit exceeded")) {
    // Show user their usage and suggest waiting
    showTokenLimitExceededMessage();
  } else if (error.message.includes("would exceed daily token limit")) {
    // Suggest shorter prompt
    showPromptTooLongMessage();
  } else {
    // Handle other errors
    showGenericErrorMessage(error.message);
  }
}
```

### Best Practices for Token Management

1. **Check limits before requests** - Use `/ai/can-request` endpoint
2. **Show usage in UI** - Display token usage percentage to users
3. **Handle limit errors gracefully** - Provide helpful error messages
4. **Optimize prompts** - Keep prompts concise to save tokens
5. **Cache responses** - Store AI responses to avoid repeat requests

## 📱 Rate Limiting & Best Practices

### Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 10 requests per 15 minutes
- **AI Generation**: 100 requests per hour (varies by role)
- **File Operations**: 50 requests per 10 minutes
- **Project Creation**: 20 requests per hour

### Best Practices

1. **Always handle errors gracefully**
2. **Implement retry logic for failed requests**
3. **Cache responses when appropriate**
4. **Use debouncing for search inputs**
5. **Show loading states for better UX**
6. **Validate data before sending to API**
7. **Handle token expiration automatically**

### Performance Tips

```javascript
// Debounce search requests
import { debounce } from "lodash";

const debouncedSearch = debounce(async (query) => {
  try {
    const results = await searchProjects(query);
    setSearchResults(results.projects);
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}, 300);

// Cache frequently accessed data
const cache = new Map();

async function getCachedProjects(options = {}) {
  const cacheKey = JSON.stringify(options);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await getProjects(options);
  cache.set(cacheKey, result);

  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

  return result;
}
```

## 🚀 Getting Started Checklist

1. **✅ Set up API client with base configuration**
2. **✅ Implement authentication flow (login/register)**
3. **✅ Add token management and auto-refresh**
4. **✅ Create error handling utilities**
5. **✅ Implement project management features**
6. **✅ Add file management capabilities**
7. **✅ Integrate AI features**
8. **✅ Add search and filtering**
9. **✅ Implement proper loading states**
10. **✅ Test all functionality thoroughly**

## 📞 Support & Resources

- **API Health Check**: `GET /api/health`
- **API Documentation**: `GET /api/docs`
- **Version Info**: `GET /api/version`
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **API Base URL**: Update in production deployment

---

**Happy coding! 🚀 Built for African developers with ❤️**
