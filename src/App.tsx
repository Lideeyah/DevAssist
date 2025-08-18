import { Navigate, Route, Routes } from "react-router";
import BoltVersion from "@/pages/bolt";
import LandingPage from "@/pages/landing-page";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Layout from "@/components/router/layout";
import { RedirectIfAuth } from "@/components/router/auth";

import Dashboard from "@/pages/dashboard";
import OnboardingLayout from "@/pages/onboarding/layout";
import SelectCountry from "@/pages/onboarding/select-country";
import SelectPath from "@/pages/onboarding/select-path";

export default function App() {
   const data = "authClient.useSession()";

   return (
      <Routes>
         <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/bolt-version" element={<BoltVersion />} />

            <Route path="/onboarding" element={<OnboardingLayout />}>
               <Route index element={<Navigate to="country" replace />} />
               <Route path="country" element={<SelectCountry />} />
               <Route path="path" element={<SelectPath />} />
            </Route>

            <Route
               path="/auth/sign-in"
               element={
                  <RedirectIfAuth isAuthenticated={!!data}>
                     <SignIn />
                  </RedirectIfAuth>
               }
            />
            <Route
               path="/auth/sign-up"
               element={
                  <RedirectIfAuth isAuthenticated={!!data}>
                     <SignUp />
                  </RedirectIfAuth>
               }
            />
         </Route>
      </Routes>
   );
}
