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
  isLoading: boolean;
  login: (params: LoginParams) => Promise<User | undefined>;
  signup: (params: SignUpParams) => Promise<User | undefined>;
  logout: () => void;
  updateOnboardingStatus: (completed: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useLayoutEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const tokens = api.getTokens();

    if (!tokens?.accessToken) {
      return false;
    }

    try {
      const response = await api.request<User>("GET", "/auth/me");

      if (response.success && response.data) {
        setUser(response.data);

        const normalizedEmail = response.data.email.toLowerCase();
        const userOnboardingKey = `onboarding_${normalizedEmail}`;
        const storedOnboardingStatus = localStorage.getItem(userOnboardingKey);

        if (storedOnboardingStatus === null) {
          const generalStatus = localStorage.getItem("onboarding_completed") || "false";
          localStorage.setItem(userOnboardingKey, generalStatus);
        } else {
          localStorage.setItem("onboarding_completed", storedOnboardingStatus);
        }

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
      return false;
    }
  };

  async function login({ email, password }: LoginParams) {
    try {
      const response = await api.request<LoginResponse>("POST", "/auth/login", { email, password }, false);

      if (response.success && response.data) {
        api.setTokens({
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken,
        });

        const normalizedEmail = email.toLowerCase();
        const userOnboardingKey = `onboarding_${normalizedEmail}`;
        const userOnboardingDataKey = `onboarding_data_${normalizedEmail}`;
        const previouslyCompleted = localStorage.getItem(userOnboardingKey) === "true";

        // Restore onboarding data if it exists
        const savedOnboardingData = localStorage.getItem(userOnboardingDataKey);
        if (savedOnboardingData) {
          localStorage.setItem("onboard:v1", savedOnboardingData);
        }

        const meResponse = await api.request<User>("GET", "/auth/me");
        if (meResponse.success && meResponse.data) {
          const userData = {
            ...meResponse.data,
            hasCompletedOnboarding: previouslyCompleted,
          };
          setUser(userData);

          localStorage.setItem("onboarding_completed", previouslyCompleted ? "true" : "false");
          localStorage.setItem(userOnboardingKey, previouslyCompleted ? "true" : "false");

          return userData;
        }

        if (response.data.user) {
          const userData = {
            ...response.data.user,
            hasCompletedOnboarding: previouslyCompleted,
          };
          setUser(userData);
          localStorage.setItem("onboarding_completed", previouslyCompleted ? "true" : "false");
          localStorage.setItem(userOnboardingKey, previouslyCompleted ? "true" : "false");
          return userData;
        }
      }

      throw new Error(response.error ?? response.message ?? "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function signup({ fullName, email, password }: SignUpParams) {
    try {
      // Split the full name into first and last name
      const nameParts = fullName.trim().split(/\s+/);
      const Fname = nameParts[0] || "";
      const Lname = nameParts.slice(1).join(" ") || "";

      // Use just the first name as username, add random numbers if needed
      let username = Fname;

      // Add 1-3 random digits to increase uniqueness
      const randomDigits = Math.floor(100 + Math.random() * 900); // Generates 100-999
      username = `${username}${randomDigits}`;

      const response = await api.request<SignUpResponse>(
        "POST",
        "/auth/register",
        {
          username: username,
          email,
          password,
        },
        false
      );

      if (response.success && response.data) {
        const { tokens, user } = response.data;

        api.setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        const userWithOnboardingStatus = user
          ? {
              ...user,
              hasCompletedOnboarding: false,
            }
          : null;

        if (userWithOnboardingStatus) {
          setUser(userWithOnboardingStatus);
          localStorage.setItem("onboarding_completed", "false");
          const userOnboardingKey = `onboarding_${email.toLowerCase()}`;
          localStorage.setItem(userOnboardingKey, "false");
          return userWithOnboardingStatus;
        }

        const meResponse = await api.request<User>("GET", "/auth/me");
        if (meResponse.success && meResponse.data) {
          const userData = { ...meResponse.data, hasCompletedOnboarding: false };
          setUser(userData);
          localStorage.setItem("onboarding_completed", "false");
          const userOnboardingKey = `onboarding_${email.toLowerCase()}`;
          localStorage.setItem(userOnboardingKey, "false");
          return userData;
        }
      }

      throw new Error(response.error ?? response.message ?? "Registration failed");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  function logout() {
    const currentUserEmail = user?.email?.toLowerCase();
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    const onboardingData = localStorage.getItem("onboard:v1"); // Get onboarding data

    if (currentUserEmail && onboardingCompleted) {
      const userOnboardingKey = `onboarding_${currentUserEmail}`;
      localStorage.setItem(userOnboardingKey, onboardingCompleted);

      // Also save onboarding data under user-specific key
      if (onboardingData) {
        const userOnboardingDataKey = `onboarding_data_${currentUserEmail}`;
        localStorage.setItem(userOnboardingDataKey, onboardingData);
      }
    }

    api.clearTokens();
    setUser(null);
    localStorage.removeItem("onboarding_completed");
    window.location.href = "/auth/sign-in";
  }

  function updateOnboardingStatus(completed: boolean) {
    if (user && user.email) {
      const updatedUser = { ...user, hasCompletedOnboarding: completed };
      setUser(updatedUser);

      const normalizedEmail = user.email.toLowerCase();
      localStorage.setItem("onboarding_completed", completed.toString());
      const userOnboardingKey = `onboarding_${normalizedEmail}`;
      localStorage.setItem(userOnboardingKey, completed.toString());

      // Also save current onboarding data
      const onboardingData = localStorage.getItem("onboard:v1");
      if (onboardingData) {
        const userOnboardingDataKey = `onboarding_data_${normalizedEmail}`;
        localStorage.setItem(userOnboardingDataKey, onboardingData);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateOnboardingStatus,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
