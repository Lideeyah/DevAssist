// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, useNavigate } from "react-router";
// import Logo from "../logo";
// import { SiGithub } from "react-icons/si";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SignIn, TSignIn } from "@/validators/sign-in";
// import { useState } from "react";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "sonner";
// import { useAuth } from "@/hooks/use-auth";

// export function LoginForm({
//    className,
//    ...props
// }: React.ComponentProps<"div">) {
//    const { login } = useAuth();
//    const {
//       register,
//       handleSubmit,
//       formState: { errors, isSubmitting },
//    } = useForm<TSignIn>({
//       resolver: zodResolver(SignIn),
//    });

//    const [isVisible, setIsVisible] = useState(false);
//    const [isLoading, setIsLoading] = useState(false);

//    const navigate = useNavigate();

//    const togglePasswordVisibility = () =>
//       setIsVisible((prevState) => !prevState);

//    async function onSubmit(data: TSignIn) {
//       try {
//          await login({
//             email: data.email,
//             password: data.password,
//          });

//          toast.success("Signed in successfully!");

//          navigate("/dashboard");
//       } catch (error) {
//          if (error instanceof Error) {
//             toast.error(error.message);
//          } else {
//             toast.error("Something went wrong!");
//          }

//          console.log(error);
//       }
//    }

//    async function signInWithGithub() {
//       setIsLoading(true);
//       try {
//          await authClient.signIn.social(
//             {
//                provider: "github",
//                callbackURL: "/dashboard",
//             },
//             {
//                onResponse: () => {
//                   setIsLoading(false);
//                },
//                onError: (ctx) => {
//                   toast.error(ctx.error.message ?? "Something went wrong!");
//                   console.log(ctx.error);
//                },
//             }
//          );
//       } catch (error) {
//          console.log(error);
//          toast.error("Something went wrong!");
//       }
//    }

//    return (
//       <div className={cn("flex flex-col gap-6", className)} {...props}>
//          <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="flex flex-col gap-4">
//                <div className="flex flex-col items-center gap-2">
//                   <Link
//                      to="/"
//                      className="flex flex-col items-center gap-2 font-medium"
//                   >
//                      <Logo />
//                   </Link>
//                   <h1 className="text-xl font-bold">Welcome background!</h1>
//                   <div className="text-center text-sm">
//                      Don&apos;t have an account?{" "}
//                      <Link
//                         to="/auth/sign-up"
//                         className="underline underline-offset-4"
//                      >
//                         Sign up
//                      </Link>
//                   </div>
//                </div>
//                <div className="flex flex-col gap-4">
//                   <div className="grid gap-2">
//                      <Label htmlFor="email">Email</Label>
//                      <Input
//                         id="email"
//                         type="email"
//                         placeholder="m@example.com"
//                         className="h-10"
//                         {...register("email")}
//                      />
//                      {errors.email && (
//                         <p className="text-xs text-destructive">
//                            {errors.email.message}
//                         </p>
//                      )}
//                   </div>
//                   <div className="grid gap-2">
//                      <Label htmlFor="password">Password</Label>
//                      <div className="relative">
//                         <Input
//                            id="password"
//                            type={isVisible ? "text" : "password"}
//                            placeholder="yourstrongpassword"
//                            className="h-10"
//                            {...register("password")}
//                         />
//                         <button
//                            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//                            type="button"
//                            onClick={togglePasswordVisibility}
//                            aria-label={
//                               isVisible ? "Hide password" : "Show password"
//                            }
//                            aria-pressed={isVisible}
//                            aria-controls="password"
//                         >
//                            {isVisible ? (
//                               <EyeOffIcon size={16} aria-hidden="true" />
//                            ) : (
//                               <EyeIcon size={16} aria-hidden="true" />
//                            )}
//                         </button>
//                      </div>
//                      {errors.password && (
//                         <p className="text-xs text-destructive">
//                            {errors.password.message}
//                         </p>
//                      )}
//                   </div>
//                   <Button
//                      size="lg"
//                      type="submit"
//                      className="w-full"
//                      disabled={isSubmitting}
//                   >
//                      Login
//                      {isSubmitting && (
//                         <svg
//                            xmlns="http://www.w3.org/2000/svg"
//                            width="24"
//                            height="24"
//                            viewBox="0 0 24 24"
//                         >
//                            <path
//                               fill="currentColor"
//                               d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
//                               opacity="0.25"
//                            />
//                            <path
//                               fill="currentColor"
//                               d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
//                            >
//                               <animateTransform
//                                  attributeName="transform"
//                                  dur="0.75s"
//                                  repeatCount="indefinite"
//                                  type="rotate"
//                                  values="0 12 12;360 12 12"
//                               />
//                            </path>
//                         </svg>
//                      )}
//                   </Button>
//                </div>
//                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
//                   <span className="bg-background text-muted-foreground relative z-10 px-2">
//                      Or
//                   </span>
//                </div>
//                <div className="grid gap-3">
//                   <Button
//                      variant="outline"
//                      size="lg"
//                      type="button"
//                      className="w-full"
//                      onClick={async () => await signInWithGithub()}
//                      disabled={isSubmitting || isLoading}
//                   >
//                      {isLoading ? (
//                         <svg
//                            xmlns="http://www.w3.org/2000/svg"
//                            width="24"
//                            height="24"
//                            viewBox="0 0 24 24"
//                         >
//                            <path
//                               fill="currentColor"
//                               d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
//                               opacity="0.25"
//                            />
//                            <path
//                               fill="currentColor"
//                               d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
//                            >
//                               <animateTransform
//                                  attributeName="transform"
//                                  dur="0.75s"
//                                  repeatCount="indefinite"
//                                  type="rotate"
//                                  values="0 12 12;360 12 12"
//                               />
//                            </path>
//                         </svg>
//                      ) : (
//                         <SiGithub />
//                      )}
//                      Continue with Github
//                   </Button>
//                </div>
//             </div>
//          </form>
//          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
//             By clicking continue, you agree to our{" "}
//             <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
//          </div>
//       </div>
//    );
// }
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import Logo from "../logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Wifi, WifiOff, Server, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SiGithub } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { SignIn, TSignIn } from "@/validators/sign-in";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignIn>({
    resolver: zodResolver(SignIn),
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const isOnline = await api.healthCheck();
      setIsServerOnline(isOnline);
    } catch (error) {
      setIsServerOnline(false);
    }
  };

  const togglePasswordVisibility = () => setIsVisible((prevState) => !prevState);

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find((error) => error.field.toLowerCase() === fieldName.toLowerCase())?.message;
  };

  async function onSubmit(data: TSignIn) {
    if (!isServerOnline) {
      toast.error("Server is offline. Please try again later.");
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      await login({
        email: data.email,
        password: data.password,
      });

      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      if (error.isValidationError && error.validationErrors) {
        setValidationErrors(error.validationErrors);
        toast.error("Please fix the validation errors below.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Authentication failed. Please try again.");
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGithub() {
    if (!isServerOnline) {
      toast.error("Server is offline. Please try again later.");
      return;
    }

    setIsLoading(true);
    try {
      await authClient.signIn.social(
        {
          provider: "github",
          callbackURL: "/dashboard",
        },
        {
          onResponse: () => {
            setIsLoading(false);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message ?? "Something went wrong!");
            console.log(ctx.error);
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Server Status Indicator */}
      <div className="flex items-center justify-center">
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

      {validationErrors.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded text-sm">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Link to="/" className="flex flex-col items-center gap-2 font-medium">
              <Logo />
            </Link>
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={`h-10 ${getFieldError("email") ? "border-red-500 focus:border-red-500" : ""}`}
                {...register("email")}
                disabled={isLoading || !isServerOnline}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              {getFieldError("email") && <p className="text-red-400 text-xs mt-1">{getFieldError("email")}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="yourstrongpassword"
                  className={`h-10 ${getFieldError("password") ? "border-red-500 focus:border-red-500" : ""}`}
                  {...register("password")}
                  disabled={isLoading || !isServerOnline}
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                  disabled={isLoading || !isServerOnline}
                >
                  {isVisible ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              {getFieldError("password") && <p className="text-red-400 text-xs mt-1">{getFieldError("password")}</p>}
            </div>
            <Button size="lg" type="submit" className="w-full" disabled={isSubmitting || isLoading || !isServerOnline}>
              Login
              {isSubmitting && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="ml-2">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" />
                  <path
                    fill="currentColor"
                    d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                  >
                    <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                  </path>
                </svg>
              )}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">Or</span>
          </div>
          <div className="grid gap-3">
            <Button
              variant="outline"
              size="lg"
              type="button"
              className="w-full"
              onClick={async () => await signInWithGithub()}
              disabled={isSubmitting || isLoading || !isServerOnline}
            >
              {isLoading ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                  <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" />
                  <path
                    fill="currentColor"
                    d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                  >
                    <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                  </path>
                </svg>
              ) : (
                <SiGithub className="mr-2" />
              )}
              Continue with Github
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
