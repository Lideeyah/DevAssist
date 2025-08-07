import { Route, Routes } from "react-router";
import BoltVersion from "@/pages/bolt.dev";
import LandingPage from "@/pages/landing-page";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";

export default function App() {
   return (
      <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/bolt-version" element={<BoltVersion />} />
         
         
         {/* Auth Routes */}
         <Route path="/auth/sign-in" element={<SignIn />} />
         <Route path="/auth/sign-up" element={<SignUp />} />
         
      </Routes>
   );
}
