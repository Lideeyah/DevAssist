export interface User {
  tokenUsage: {
    daily: {
      tokensUsed: number;
      requestCount: number;
      date: string;
    };
    monthly: {
      tokensUsed: number;
      requestCount: number;
      month: string;
    };
    totalTokensUsed: number;
    totalRequests: number;
  };
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface SignUpResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}
