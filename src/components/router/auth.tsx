import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setRedirectTo("/auth/sign-in");
      } else if (user?.email) {
        const userOnboardingKey = `onboarding_${user.email.toLowerCase()}`;
        const storedStatus = localStorage.getItem(userOnboardingKey);
        const hasCompletedOnboarding = storedStatus === "true";

        if (storedStatus === null) {
          localStorage.setItem(userOnboardingKey, "true");
          localStorage.setItem("onboarding_completed", "true");
          setShouldRender(true);
        } else if (hasCompletedOnboarding) {
          setShouldRender(true);
        } else {
          setRedirectTo("/onboarding/country");
        }
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!shouldRender) {
    return <div>Loading...</div>;
  }

  return children;
}

interface RedirectIfAuthProps {
  children: JSX.Element;
  redirectTo?: string;
}

export function RedirectIfAuth({ children, redirectTo = "/dashboard" }: RedirectIfAuthProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      const userOnboardingKey = `onboarding_${user.email.toLowerCase()}`;
      const storedStatus = localStorage.getItem(userOnboardingKey);
      const hasCompletedOnboarding = storedStatus === "true";

      if (hasCompletedOnboarding) {
        setRedirectPath(redirectTo);
      } else {
        setRedirectPath("/onboarding/country");
      }
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading, user, redirectTo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (shouldRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
