import { createContext, PropsWithChildren, useLayoutEffect, useState } from "react";
import { api } from "@/api";
import { LoginResponse, SignUpResponse, User } from "@/types/auth";

interface LoginParams {
   email: string;
   password: string;
}

interface SignUpParams {
   fullName: string;
   email: string;
   password: string;
}

interface AuthContext {
   user: User | null;
   isAuthenticated: boolean;
   login: (params: LoginParams) => Promise<User | undefined>;
   signup: (params: SignUpParams) => Promise<User | undefined>;
   logout: () => void;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
   const [user, setUser] = useState<User | null>(null);
   const isAuthenticated = !!user;

   useLayoutEffect(() => {
      const tokens = api.getTokens();

      if (tokens?.accessToken) {
         api.request<User>("GET", "/auth/me").then((res) => {
            if (res.success && res.data) {
               setUser(res.data);
            } else {
               logout();
            }
         });
      }
   }, []);

   async function login({
      email,
      password,
   }: {
      email: string;
      password: string;
   }) {
      const response = await api.request<LoginResponse>(
         "POST",
         "/auth/login",
         { email, password },
         false
      );
      
      console.log(response);

      if (response.success) {
         api.setTokens({
            accessToken: response.data?.tokens.accessToken ?? "",
            refreshToken: response.data?.tokens.refreshToken ?? "",
         });

         if (response.data?.user) {
            setUser(response.data.user);
            return response.data.user;
         }

         const me = await api.request<User>("GET", "/auth/me");
         if (me.success && me.data) {
            setUser(me.data);
            return me.data;
         }
      }

      throw new Error(response.error ?? response.message ?? "Login failed");
   }

   async function signup({
      fullName,
      email,
      password,
   }: {
      fullName: string;
      email: string;
      password: string;
   }) {
      const response = await api.request<SignUpResponse>(
         "POST",
         "/auth/register",
         { username: fullName, email, password },
         false
      );

      console.log(response);
      if (response.success && response.data) {
         const { tokens, user,  } = response.data;

         api.setTokens({
            accessToken: tokens.accessToken ?? "",
            refreshToken: tokens.refreshToken ?? "",
         });

         if (user) {
            setUser(user);
            return user;
         }

         const me = await api.request<User>("GET", "/auth/me");
         if (me.success && me.data) {
            setUser(me.data);
            return me.data;
         }
      }

      throw new Error(response.error ?? response.message ?? "Registration failed");
   }

   function logout() {
      api.clearTokens();
      setUser(null);
   }

   return (
      <AuthContext.Provider
         value={{ user, isAuthenticated, login, signup, logout }}
      >
         {children}
      </AuthContext.Provider>
   );
}
