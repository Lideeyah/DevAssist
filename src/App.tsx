import { Route, Routes } from "react-router";
import BoltVersion from "@/pages/bolt";
import LandingPage from "@/pages/landing-page";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Layout from "@/components/router/layout";
import { ProtectedRoute, RedirectIfAuth } from "@/components/router/auth";
import { authClient } from "@/lib/auth-client";
import Dashboard from "@/pages/dashboard";

export default function App() {
   const { data } = authClient.useSession();

   return (
      <Routes>
         <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route
               path="/dashboard"
               element={
                  <ProtectedRoute isAuthenticated={!!data?.user}>
                     <Dashboard />
                  </ProtectedRoute>
               }
            />

            <Route path="/bolt-version" element={<BoltVersion />} />

            {/* Auth Routes */}
            <Route
               path="/auth/sign-in"
               element={
                  <RedirectIfAuth isAuthenticated={!!data?.user}>
                     <SignIn />
                  </RedirectIfAuth>
               }
            />
            <Route
               path="/auth/sign-up"
               element={
                  <RedirectIfAuth isAuthenticated={!!data?.user}>
                     <SignUp />
                  </RedirectIfAuth>
               }
            />
         </Route>
      </Routes>
   );
}
