import { Navigate, Route, Routes } from "react-router";
import BoltVersion from "@/pages/bolt";
import LandingPage from "@/pages/landing-page";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Layout from "@/components/router/layout";
import { RedirectIfAuth, ProtectedRoute } from "@/components/router/auth";
import OnboardingLayout from "@/pages/onboarding/layout";
import SelectCountry from "@/pages/onboarding/select-country";
import SelectPath from "@/pages/onboarding/select-path";
import DashboardLayout from "./pages/dashboard/layout";
import { Suspense } from "react";
import Overview from "@/pages/dashboard/overview";
import Settings from "@/pages/dashboard/settings";
import MonacoIDE from "./components/dashboard/MonacoIDE/monacoIDE";
import SmeSetup from "@/pages/dashboard/smeSetup";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function AuthDebugger() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user?.email) {
      const userKey = `onboarding_${user.email}`;
      const userStatus = localStorage.getItem(userKey);
      const generalStatus = localStorage.getItem("onboarding_completed");

      console.log("=== AUTH DEBUG ===");
      console.log("User:", user.email);
      console.log("User onboarding status:", userStatus);
      console.log("General onboarding status:", generalStatus);
      console.log("Is authenticated:", isAuthenticated);
      console.log("===================");
    }
  }, [isAuthenticated, user]);

  return null;
}

export default function App() {
  return (
    <>
      <AuthDebugger />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/bolt-version" element={<BoltVersion />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route index element={<Navigate to="country" replace />} />
            <Route path="country" element={<SelectCountry />} />
            <Route path="path" element={<SelectPath />} />
          </Route>

          {/* dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route
              path="overview"
              element={
                <Suspense fallback={<div>Loading overview…</div>}>
                  <Overview />
                </Suspense>
              }
            />
            <Route
              path="sme"
              element={
                <Suspense fallback={<div>Loading sme bulder...</div>}>
                  <SmeSetup />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<div>Loading settings…</div>}>
                  <Settings />
                </Suspense>
              }
            />
          </Route>

          {/* IDE */}
          <Route
            path="ide"
            element={
              <Suspense fallback={<div>Loading IDE...</div>}>
                <MonacoIDE />
              </Suspense>
            }
          />

          {/* sign in */}
          <Route
            path="/auth/sign-in"
            element={
              <RedirectIfAuth>
                <SignIn />
              </RedirectIfAuth>
            }
          />

          {/* sign up */}
          <Route
            path="/auth/sign-up"
            element={
              <RedirectIfAuth>
                <SignUp />
              </RedirectIfAuth>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
