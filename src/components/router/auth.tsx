import { Navigate } from "react-router";

interface RedirectIfAuthProps {
   children: JSX.Element;
   isAuthenticated: boolean;
   redirectTo?: string;
}

export function RedirectIfAuth({
   children,
   isAuthenticated,
   redirectTo = "/dashboard",
}: RedirectIfAuthProps) {
   if (isAuthenticated) {
      return <Navigate to={redirectTo} replace />;
   }
   return children;
}

export function ProtectedRoute({
   children,
   isAuthenticated,
}: {
   children: JSX.Element;
   isAuthenticated: boolean;
}) {
   if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
   return children;
}
