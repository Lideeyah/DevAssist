import React, { useState } from "react";
import { X, Github, Mail, Eye, EyeOff, Zap } from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
   onSuccess: (userData: User) => void;
   onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onClose }) => {
   const [isLogin, setIsLogin] = useState(true);
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      name: "",
   });
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
         const userData = {
            id: Date.now().toString(),
            email: formData.email,
            name: formData.name || formData.email.split("@")[0],
            userType: null,
            country: "",
            currency: "",
            aiModel: "",
         };

         onSuccess(userData);
         setLoading(false);
      }, 1500);
   };

   const handleGithubAuth = () => {
      setLoading(true);
      // Simulate GitHub OAuth
      setTimeout(() => {
         const userData = {
            id: Date.now().toString(),
            email: "user@github.com",
            name: "GitHub User",
            userType: null,
            country: "",
            currency: "",
            aiModel: "",
         };

         onSuccess(userData);
         setLoading(false);
      }, 2000);
   };

   return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#6C33FF] to-[#00A676] p-6 text-white">
               <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5" />
               </button>

               <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold">DevAssist</h1>
                     <p className="text-white/80 text-sm">
                        AI-Powered IDE for Africa's Leading Developers
                     </p>
                  </div>
               </div>
            </div>

            {/* Form */}
            <div className="p-6">
               <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                     {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                     {isLogin
                        ? "Sign in to continue coding"
                        : "Join thousands of African developers"}
                  </p>
               </div>

               {/* GitHub OAuth */}
               <button
                  onClick={handleGithubAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 bg-[#24292e] hover:bg-[#1a1e22] text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
               >
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
               </button>

               <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-white dark:bg-[#161B22] text-gray-500 dark:text-gray-400">
                        or continue with email
                     </span>
                  </div>
               </div>

               {/* Email Form */}
               <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Full Name
                        </label>
                        <input
                           type="text"
                           value={formData.name}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 name: e.target.value,
                              }))
                           }
                           className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           placeholder="Enter your full name"
                           required={!isLogin}
                        />
                     </div>
                  )}

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                     </label>
                     <div className="relative">
                        <input
                           type="email"
                           value={formData.email}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 email: e.target.value,
                              }))
                           }
                           className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           placeholder="Enter your email"
                           required
                        />
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                     </label>
                     <div className="relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           value={formData.password}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 password: e.target.value,
                              }))
                           }
                           className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           placeholder="Enter your password"
                           required
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                           {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                           ) : (
                              <Eye className="w-5 h-5" />
                           )}
                        </button>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-gradient-to-r from-[#6C33FF] to-[#00A676] hover:from-[#5A2BD8] hover:to-[#008A63] text-white py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                     {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : isLogin ? (
                        "Sign In"
                     ) : (
                        "Create Account"
                     )}
                  </button>
               </form>

               {/* Toggle */}
               <div className="text-center mt-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                     {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                     <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-[#6C33FF] hover:text-[#5A2BD8] font-medium"
                     >
                        {isLogin ? "Sign Up" : "Sign In"}
                     </button>
                  </p>
               </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-[#0D0D0D] px-6 py-4 text-center">
               <p className="text-xs text-gray-500 dark:text-gray-400">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
               </p>
            </div>
         </div>
      </div>
   );
};

export default AuthModal;
