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
import MonacoIDE from "./components/Monaco IDE/monacoIDE";
import PromptSetup from "./pages/dashboard/PromptSetup";
import { useAuth } from "@/hooks/use-auth";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />

        <Route path="/bolt-version" element={<BoltVersion />} />

        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<Navigate to="country" replace />} />
          <Route path="country" element={<SelectCountry />} />
          <Route path="path" element={<SelectPath />} />
        </Route>

        <Route
          path="ide"
          element={
            <Suspense fallback={<div>Loading IDE...</div>}>
              <MonacoIDE />
            </Suspense>
          }
        />

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
              <Suspense fallback={<div>Loading Prompt...</div>}>
                <PromptSetup />
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

        <Route
          path="ide"
          element={
            <Suspense fallback={<div>Loading IDE...</div>}>
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MonacoIDE />
              </ProtectedRoute>
            </Suspense>
          }
        />

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
            path="prompt"
            element={
              <Suspense fallback={<div>Loading Prompt...</div>}>
                <PromptSetup />
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

        <Route
          path="/auth/sign-in"
          element={
            <RedirectIfAuth>
              <SignIn />
            </RedirectIfAuth>
          }
        />

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
  );
}
