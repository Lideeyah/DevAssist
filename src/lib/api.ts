// const API_BASE = import.meta.env.VITE_API_URL || "https://devassit-api.onrender.com/api";

// interface Tokens {
//   accessToken: string;
//   refreshToken: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   role: string;
// }

// interface TokenUsage {
//   daily: {
//     used: number;
//     limit: number;
//     remaining: number;
//   };
// }

// interface AIResponse {
//   response: string;
//   mode: string;
//   model: string;
//   tokensUsed: {
//     input: number;
//     output: number;
//     total: number;
//   };
//   responseTime: number;
//   contextFiles: Array<{ filename: string; size: number }>;
//   interactionId: string;
// }

// class DevAssistAPI {
//   private accessToken: string | null = null;
//   private refreshToken: string | null = null;

//   constructor() {
//     this.accessToken = localStorage.getItem("accessToken");
//     this.refreshToken = localStorage.getItem("refreshToken");
//   }

//   private getHeaders(includeAuth = true): HeadersInit {
//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//     };

//     if (includeAuth && this.accessToken) {
//       headers["Authorization"] = `Bearer ${this.accessToken}`;
//     }

//     return headers;
//   }

//   //   private async request(method: string, endpoint: string, data: any = null, includeAuth = true): Promise<any> {
//   //     const url = `${API_BASE}${endpoint}`;
//   //     console.log("API Request:", method, url, data);

//   //     const options: RequestInit = {
//   //       method,
//   //       headers: this.getHeaders(includeAuth),
//   //       mode: "cors",
//   //     };

//   //     if (data && ["POST", "PUT", "PATCH"].includes(method)) {
//   //       options.body = JSON.stringify(data);
//   //     }

//   //     try {
//   //       const response = await fetch(url, options);

//   //       const contentType = response.headers.get("content-type");
//   //       let result;

//   //       if (contentType && contentType.includes("application/json")) {
//   //         result = await response.json();
//   //       } else {
//   //         const text = await response.text();
//   //         throw new Error(`Server returned non-JSON response: ${text}`);
//   //       }

//   //       if (!response.ok) {
//   //         // Handle validation errors specifically - check the actual API response structure
//   //         console.log("API Error Response:", result);

//   //         if (response.status === 400 && result.errors && Array.isArray(result.errors)) {
//   //           // The API returns errors in an array format
//   //           const validationErrors = result.errors.map((error: any) => ({
//   //             field: error.field || "unknown",
//   //             message: error.message || "Validation error",
//   //           }));
//   //           throw {
//   //             message: "Validation failed",
//   //             validationErrors,
//   //             isValidationError: true,
//   //           };
//   //         }

//   //         throw new Error(result.message || `API request failed with status ${response.status}`);
//   //       }

//   //       return result;
//   //     } catch (error) {
//   //       console.error("API request error:", error);
//   //       throw error;
//   //     }
//   //   }

//   private async request(method: string, endpoint: string, data: any = null, includeAuth = true): Promise<any> {
//     const url = `${API_BASE}${endpoint}`;
//     console.log("API Request:", method, url, data);

//     const options: RequestInit = {
//       method,
//       headers: this.getHeaders(includeAuth),
//       mode: "cors",
//     };

//     if (data && ["POST", "PUT", "PATCH"].includes(method)) {
//       options.body = JSON.stringify(data);
//     }

//     try {
//       const response = await fetch(url, options);

//       const contentType = response.headers.get("content-type");
//       let result;

//       if (contentType && contentType.includes("application/json")) {
//         result = await response.json();
//         console.log("Response JSON:", result); // DEBUG
//       } else {
//         const text = await response.text();
//         console.log("Response text:", text); // DEBUG
//         throw new Error(`Server returned non-JSON response: ${text}`);
//       }

//       if (!response.ok) {
//         console.log("API Error Details:", {
//           status: response.status,
//           result: result,
//           hasErrors: !!result.errors,
//           errorsType: Array.isArray(result.errors) ? "array" : typeof result.errors,
//         });

//         // Handle validation errors - check the actual structure
//         if (response.status === 400) {
//           let validationErrors: ValidationError[] = [];

//           // Check if errors array exists and has proper structure
//           if (result.errors && Array.isArray(result.errors)) {
//             validationErrors = result.errors.map((error: any) => ({
//               field: error.field || error.path || "unknown",
//               message: error.message || error.msg || "Validation error",
//               value: error.value,
//             }));
//           }

//           // If we found validation errors, throw them
//           if (validationErrors.length > 0) {
//             throw {
//               message: result.message || "Validation failed",
//               validationErrors,
//               isValidationError: true,
//             };
//           }

//           // If no specific validation errors but there's a message
//           if (result.message) {
//             throw new Error(result.message);
//           }
//         }

//         throw new Error(result.message || `API request failed with status ${response.status}`);
//       }

//       return result;
//     } catch (error) {
//       console.error("API request error:", error);
//       throw error;
//     }
//   }
//   // Auth methods
//   async login(email: string, password: string): Promise<User> {
//     const response = await this.request("POST", "/auth/login", { email, password }, false);
//     this.setTokens(response.data.tokens);
//     return response.data.user;
//   }

//   async register(userData: { username: string; email: string; password: string; role?: string }): Promise<User> {
//     const response = await this.request("POST", "/auth/register", userData, false);
//     this.setTokens(response.data.tokens);
//     return response.data.user;
//   }

//   async generateAIResponse(prompt: string, mode: "generate" | "explain" = "generate", projectId?: string): Promise<AIResponse> {
//     const response = await this.request("POST", "/ai/generate", {
//       prompt,
//       mode,
//       projectId,
//     });
//     return response.data;
//   }

//   async getTokenUsage(): Promise<TokenUsage> {
//     const response = await this.request("GET", "/ai/token-usage");
//     return response.data;
//   }

//   async canMakeAIRequest(): Promise<{ canMakeRequest: boolean; message: string; tokensRemaining: number }> {
//     const response = await this.request("GET", "/ai/can-request");
//     return response.data;
//   }

//   async getProfile(): Promise<User> {
//     const response = await this.request("GET", "/auth/me");
//     return response.data;
//   }

//   async healthCheck(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE}/health`);
//       return response.ok;
//     } catch (error) {
//       console.error("Health check failed:", error);
//       return false;
//     }
//   }

//   private setTokens(tokens: Tokens) {
//     this.accessToken = tokens.accessToken;
//     this.refreshToken = tokens.refreshToken;
//     localStorage.setItem("accessToken", tokens.accessToken);
//     localStorage.setItem("refreshToken", tokens.refreshToken);
//   }

//   clearTokens() {
//     this.accessToken = null;
//     this.refreshToken = null;
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//   }

//   isAuthenticated(): boolean {
//     return !!this.accessToken;
//   }
// }

// export const api = new DevAssistAPI();

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
    return mimeTypes[extension as keyof typeof mimeTypes] || "text/plain";
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