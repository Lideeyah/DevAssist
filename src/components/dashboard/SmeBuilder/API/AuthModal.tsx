import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Wifi, WifiOff, Server, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { OnboardState } from "@/types/onboarding";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

interface ValidationError {
  field: string;
  message: string;
  value?: string;
}

interface ApiError extends Error {
  validationErrors?: ValidationError[];
  isValidationError?: boolean;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);
  const onboardingData: OnboardState = JSON.parse(localStorage.getItem("onboard:v1") ?? "{}");

  useEffect(() => {
    if (isOpen) {
      checkServerStatus();
      setError("");
      setValidationErrors([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setError("");
    setValidationErrors([]);
  }, [isLogin]);

  const checkServerStatus = async () => {
    try {
      const isOnline = await api.healthCheck();
      setIsServerOnline(isOnline);
    } catch (error) {
      setIsServerOnline(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isServerOnline) {
      setError("Server is offline. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError("");
    setValidationErrors([]);

    try {
      let user;
      if (isLogin) {
        user = await api.login(email, password);
      } else {
        user = await api.register({ username, email, password, role: onboardingData.path.selected });
      }
      onLogin(user);
      onClose();
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error: any) {
      if (error.isValidationError && error.validationErrors) {
        setValidationErrors(error.validationErrors);
        setError("Please fix the validation errors below.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find((error) => error.field.toLowerCase() === fieldName.toLowerCase())?.message;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md relative border border-neutral-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center justify-center mb-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isServerOnline === null
                ? "bg-yellow-500/20 text-yellow-300"
                : isServerOnline
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isServerOnline === null ? (
              <>
                <Server size={14} className="animate-pulse" />
                Checking server...
              </>
            ) : isServerOnline ? (
              <>
                <Wifi size={14} />
                Server online
              </>
            ) : (
              <>
                <WifiOff size={14} />
                Server offline
              </>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {error && !validationErrors.length && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded mb-4 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded mb-4 text-sm">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside ml-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>
                  <span className="font-medium capitalize">{error.field}</span>: {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 bg-neutral-800 rounded border focus:outline-none transition-colors ${
                  getFieldError("username") ? "border-red-500 focus:border-red-500" : "border-neutral-600 focus:border-blue-500"
                }`}
                placeholder="Enter your username (3-20 characters)"
                required
                minLength={3}
                maxLength={20}
                disabled={isLoading || !isServerOnline}
              />
              {getFieldError("username") && <p className="text-red-400 text-xs mt-1">{getFieldError("username")}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 bg-neutral-800 rounded border focus:outline-none transition-colors ${
                getFieldError("email") ? "border-red-500 focus:border-red-500" : "border-neutral-600 focus:border-blue-500"
              }`}
              placeholder="Enter your email"
              required
              disabled={isLoading || !isServerOnline}
            />
            {getFieldError("email") && <p className="text-red-400 text-xs mt-1">{getFieldError("email")}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 bg-neutral-800 rounded border focus:outline-none transition-colors ${
                getFieldError("password") ? "border-red-500 focus:border-red-500" : "border-neutral-600 focus:border-blue-500"
              }`}
              placeholder="Enter your password (min. 6 characters)"
              required
              minLength={6}
              disabled={isLoading || !isServerOnline}
            />
            {getFieldError("password") && <p className="text-red-400 text-xs mt-1">{getFieldError("password")}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isServerOnline}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setValidationErrors([]);
            }}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors disabled:text-neutral-500"
            disabled={isLoading}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
