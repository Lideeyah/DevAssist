const API_BASE = import.meta.env.VITE_API_URL || "https://devassit-api.onrender.com/api";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface TokenUsage {
  daily: {
    used: number;
    limit: number;
    remaining: number;
  };
}

interface AIResponse {
  response: string;
  mode: string;
  model: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  responseTime: number;
  contextFiles: Array<{ filename: string; size: number }>;
  interactionId: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface File {
  filename: string;
  content: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: string;
}

class DevAssistAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request(method: string, endpoint: string, data: any = null, includeAuth = true): Promise<any> {
    const url = `${API_BASE}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(includeAuth),
      mode: "cors",
    };

    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      if (!response.ok) {
        if (response.status === 400 && result.errors && Array.isArray(result.errors)) {
          const validationErrors = result.errors.map((error: any) => ({
            field: error.field || "unknown",
            message: error.message || "Validation error",
          }));
          throw {
            message: result.message || "Validation failed",
            validationErrors,
            isValidationError: true,
          };
        }

        throw new Error(result.message || `API request failed with status ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<User> {
    const response = await this.request("POST", "/auth/login", { email, password }, false);
    this.setTokens(response.data.tokens);
    return response.data.user;
  }

  async register(userData: { username: string; email: string; password: string; role?: string }): Promise<User> {
    const response = await this.request("POST", "/auth/register", userData, false);
    this.setTokens(response.data.tokens);
    return response.data.user;
  }

  async generateAIResponse(prompt: string, mode: "generate" | "explain" = "generate", projectId?: string): Promise<AIResponse> {
    const response = await this.request("POST", "/ai/generate", {
      prompt,
      mode,
      projectId,
    });
    return response.data;
  }

  async getTokenUsage(): Promise<TokenUsage> {
    const response = await this.request("GET", "/ai/token-usage");
    return response.data;
  }

  async canMakeAIRequest(): Promise<{ canMakeRequest: boolean; message: string; tokensRemaining: number }> {
    const response = await this.request("GET", "/ai/can-request");
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.request("GET", "/auth/me");
    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Project methods
  async createProject(projectData: { name: string; description?: string; language?: string; tags?: string[]; isPublic?: boolean }): Promise<Project> {
    const response = await this.request("POST", "/projects", projectData);
    return response.data;
  }

  async createFile(
    projectId: string,
    fileData: {
      filename: string;
      content: string;
      mimeType?: string;
    }
  ): Promise<File> {
    const response = await this.request("POST", `/projects/${projectId}/files`, fileData);
    return response.data;
  }

  async getProjectFiles(projectId: string): Promise<File[]> {
    const response = await this.request("GET", `/projects/${projectId}/files`);
    return response.data.files;
  }

  async updateFile(projectId: string, filename: string, content: string): Promise<File> {
    const response = await this.request("PUT", `/projects/${projectId}/files/${encodeURIComponent(filename)}`, {
      content,
      mimeType: this.getMimeType(filename),
    });
    return response.data;
  }

  private getMimeType(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      html: "text/html",
      css: "text/css",
      js: "text/javascript",
      jsx: "text/jsx",
      ts: "text/typescript",
      tsx: "text/tsx",
      json: "application/json",
      md: "text/markdown",
    };
    return mimeTypes[extension] || "text/plain";
  }

  private setTokens(tokens: Tokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const api = new DevAssistAPI();
