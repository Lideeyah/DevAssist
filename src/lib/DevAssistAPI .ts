const API_BASE = import.meta.env.VITE_API_URL || "https://devassit-api.onrender.com/api";

export class DevAssistAPI {
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

      // Check if token is expired or invalid
      if (response.status === 401 && this.accessToken && includeAuth) {
        console.log("Token expired or invalid, attempting refresh...");
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          console.log("Token refreshed successfully, retrying request...");
          // Retry the original request with new token
          return this.request(method, endpoint, data, includeAuth);
        } else {
          // Refresh failed, clear tokens and throw error
          this.clearTokens();
          throw new Error("Authentication failed. Please log in again.");
        }
      }

      // Handle other unauthorized cases
      if (response.status === 401 && !this.accessToken && includeAuth) {
        throw new Error("Please log in to access this feature.");
      }

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          throw new Error("Server returned invalid JSON response");
        }
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

      // Re-throw the error with a more user-friendly message if it's an authentication error
      if (error instanceof Error && error.message.includes("Authorization")) {
        throw new Error("Authentication required. Please log in again.");
      }

      throw error;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        console.log("No refresh token available");
        return false;
      }

      console.log("Refreshing access token...");
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        console.log("Token refresh failed with status:", response.status);
        return false;
      }

      const result = await response.json();

      if (result.data && result.data.tokens) {
        this.setTokens(result.data.tokens);
        console.log("Access token refreshed successfully");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return false;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.request("POST", "/auth/login", { email, password }, false);
      this.setTokens(response.data.tokens);
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async register(userData: { username: string; email: string; password: string; role?: string }): Promise<any> {
    try {
      const response = await this.request("POST", "/auth/register", userData, false);
      this.setTokens(response.data.tokens);
      return response.data.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async generateAIResponse(prompt: string, mode: "generate" | "explain" = "generate", projectId?: string): Promise<any> {
    try {
      const response = await this.request("POST", "/ai/generate", {
        prompt,
        mode,
        projectId,
      });
      return response.data;
    } catch (error) {
      console.error("AI generation failed:", error);
      throw error;
    }
  }

  async getTokenUsage(): Promise<any> {
    return await this.request("GET", "/ai/token-usage");
  }

  async canMakeAIRequest(): Promise<any> {
    return await this.request("GET", "/ai/can-request");
  }

  async getProfile(): Promise<any> {
    return await this.request("GET", "/auth/me");
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
  async createProject(projectData: { name: string; description?: string; language?: string; tags?: string[]; isPublic?: boolean }): Promise<any> {
    return await this.request("POST", "/projects", projectData);
  }

  async createFile(projectId: string, fileData: { filename: string; content: string; mimeType?: string }): Promise<any> {
    return await this.request("POST", `/projects/${projectId}/files`, fileData);
  }

  async getProjectFiles(projectId: string): Promise<any> {
    const response = await this.request("GET", `/projects/${projectId}/files`);
    return response.data.files;
  }

  async updateFile(projectId: string, filename: string, content: string): Promise<any> {
    return await this.request("PUT", `/projects/${projectId}/files/${encodeURIComponent(filename)}`, {
      content,
      mimeType: this.getMimeType(filename),
    });
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

  private setTokens(tokens: any) {
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

  // Helper method to check if tokens exist and are valid
  async validateAuth(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await this.getProfile();
      return true;
    } catch (error) {
      console.log("Auth validation failed:", error);
      return false;
    }
  }
}

export const api = new DevAssistAPI();
