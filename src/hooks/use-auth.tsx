import { AuthContext } from "@/components/auth/provider";
import { useContext } from "react";

export function useAuth() {
   const authContext = useContext(AuthContext);

   if (!authContext) {
      throw new Error("useAuth should be used inside AuthProvider");
   }

   return authContext;
}
