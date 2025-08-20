import { Navigate, Route, Routes } from "react-router";
import BoltVersion from "@/pages/bolt";
import LandingPage from "@/pages/landing-page";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Layout from "@/components/router/layout";
import { RedirectIfAuth } from "@/components/router/auth";

import OnboardingLayout from "@/pages/onboarding/layout";
import SelectCountry from "@/pages/onboarding/select-country";
import SelectPath from "@/pages/onboarding/select-path";
import DashboardLayout from "./pages/dashboard/layout";
import { Suspense } from "react";
import Overview from "@/pages/dashboard/overview";
import Settings from "@/pages/dashboard/settings";
import IDE from "@/pages/dashboard/IDE";
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

            <Route path="/dashboard" element={<DashboardLayout />}>
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
                  path="IDE"
                  element={
                     <Suspense fallback={<div>Loading IDE...</div>}>
                        <IDE />
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
                  <RedirectIfAuth isAuthenticated={isAuthenticated}>
                     <SignIn />
                  </RedirectIfAuth>
               }
            />
            <Route
               path="/auth/sign-up"
               element={
                  <RedirectIfAuth isAuthenticated={isAuthenticated}>
                     <SignUp />
                  </RedirectIfAuth>
               }
            />
         </Route>
      </Routes>
   );
}
