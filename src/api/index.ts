const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type APIResponse<T = any> = {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  error?: string;
};

class DevAssistAPI {
  private baseURL: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: Record<string, string> = { ...API_CONFIG.headers };
    if (includeAuth && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  async request<T = any>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    data: Record<string, any> | null = null,
    includeAuth = true
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(includeAuth),
    };

    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      console.log("response", response);
      console.log("result", result);
      // Example result: {success: true, message: 'User registered successfully', data: {...}}

      if (response.status === 401 && result.message?.includes("expired")) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request<T>(method, endpoint, data, includeAuth);
        }
      }

      return {
        success: response.ok,
        status: response.status,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        error: (error as Error).message,
      };
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const result = (await response.json()) as {
          data: { tokens: Tokens };
        };
        this.setTokens(result.data.tokens);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    this.clearTokens();
    return false;
  }

  setTokens(tokens: Tokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  getTokens() {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("onboard:v1");
  }
}

export const api = new DevAssistAPI();
