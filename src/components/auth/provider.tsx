import { createContext, PropsWithChildren, useLayoutEffect, useState } from "react";
import { api } from "@/api";
import { LoginResponse, SignUpResponse, User } from "@/types/auth";

interface LoginParams {
  email: string;
  password: string;
}

interface SignUpParams {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<User | undefined>;
  signup: (params: SignUpParams) => Promise<User | undefined>;
  logout: () => void;
  updateOnboardingStatus: (completed: boolean) => void;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useLayoutEffect(() => {
    const tokens = api.getTokens();

    if (tokens?.accessToken) {
      api.request<User>("GET", "/auth/me").then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          logout();
        }
      });
    }
  }, []);

  async function login({ email, password }: { email: string; password: string }) {
    const response = await api.request<LoginResponse>("POST", "/auth/login", { email, password }, false);

    console.log(response);

    if (response.success) {
      api.setTokens({
        accessToken: response.data?.tokens.accessToken ?? "",
        refreshToken: response.data?.tokens.refreshToken ?? "",
      });

      // Always get the latest user data from /auth/me to ensure onboarding status is correct
      const me = await api.request<User>("GET", "/auth/me");
      if (me.success && me.data) {
        setUser(me.data);
        return me.data;
      }

      // Fallback to response data if /auth/me fails
      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    }

    throw new Error(response.error ?? response.message ?? "Login failed");
  }

  async function signup({ fullName, email, password }: { fullName: string; email: string; password: string }) {
    const response = await api.request<SignUpResponse>(
      "POST",
      "/auth/register",
      {
        username: fullName,
        email,
        password,
      },
      false
    );

    console.log(response);
    if (response.success && response.data) {
      const { tokens, user } = response.data;

      api.setTokens({
        accessToken: tokens.accessToken ?? "",
        refreshToken: tokens.refreshToken ?? "",
      });

      // For new users, set hasCompletedOnboarding to false
      const userWithOnboardingStatus = user ? { ...user, hasCompletedOnboarding: false } : null;

      if (userWithOnboardingStatus) {
        setUser(userWithOnboardingStatus);
        return userWithOnboardingStatus;
      }

      const me = await api.request<User>("GET", "/auth/me");
      if (me.success && me.data) {
        // For new users, set hasCompletedOnboarding to false
        const userData = { ...me.data, hasCompletedOnboarding: false };
        setUser(userData);
        return userData;
      }
    }

    throw new Error(response.error ?? response.message ?? "Registration failed");
  }

  function logout() {
    api.clearTokens();
    setUser(null);
  }

  // Add this method to update onboarding status
  function updateOnboardingStatus(completed: boolean) {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: completed };
      setUser(updatedUser);

      // Persist to backend - this is crucial!
      api
        .request("PATCH", "/user/onboarding-status", {
          hasCompletedOnboarding: completed,
        })
        .then(() => {
          console.log("Onboarding status updated successfully");
        })
        .catch((error) => {
          console.error("Failed to update onboarding status:", error);
          // Revert the local state if backend update fails
          setUser(user);
        });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateOnboardingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
