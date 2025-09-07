import { Navigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

interface RedirectIfAuthProps {
  children: JSX.Element;
  redirectTo?: string;
}

// export function RedirectIfAuth({ children, redirectTo = "/dashboard" }: RedirectIfAuthProps) {
//   const { isAuthenticated, user } = useAuth();

//   if (isAuthenticated) {
//     // If user hasn't completed onboarding, redirect to onboarding
//     if (!user?.hasCompletedOnboarding) {
//       return <Navigate to="/onboarding/country" replace />;
//     }
//     // Otherwise redirect to the specified destination (default: dashboard)
//     return <Navigate to={redirectTo} replace />;
//   }

//   return children;
// }

export function RedirectIfAuth({ children, redirectTo = "/dashboard" }: RedirectIfAuthProps) {
  const { isAuthenticated, user } = useAuth();

  // Check both backend and localStorage for onboarding status
  const hasCompletedOnboarding = user?.hasCompletedOnboarding || localStorage.getItem("onboarding_completed") === "true";

  if (isAuthenticated) {
    if (!hasCompletedOnboarding) {
      return <Navigate to="/onboarding/country" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

// export function RedirectIfAuth({ children, redirectTo = "/dashboard" }: RedirectIfAuthProps) {
//   const { isAuthenticated, user } = useAuth();

//   console.log("RedirectIfAuth - isAuthenticated:", isAuthenticated);
//   console.log("RedirectIfAuth - user:", user);
//   console.log("RedirectIfAuth - hasCompletedOnboarding:", user?.hasCompletedOnboarding);

//   if (isAuthenticated) {
//     // If user hasn't completed onboarding, redirect to onboarding
//     if (!user?.hasCompletedOnboarding) {
//       console.log("Redirecting to onboarding - user hasn't completed onboarding");
//       return <Navigate to="/onboarding/country" replace />;
//     }
//     // Otherwise redirect to the specified destination (default: dashboard)
//     console.log("Redirecting to dashboard - user has completed onboarding");
//     return <Navigate to={redirectTo} replace />;
//   }

//   return children;
// }

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;

  // If user hasn't completed onboarding, redirect to onboarding
  if (!user?.hasCompletedOnboarding) {
    return <Navigate to="/onboarding/country" replace />;
  }

  return children;
}
