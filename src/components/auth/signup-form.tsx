import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import Logo from "../logo";
import { useForm } from "react-hook-form";
import { SignUp, TSignUp } from "@/validators/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";

export function SignUpForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<TSignUp>({
      resolver: zodResolver(SignUp),
   });

   const [isVisible, setIsVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const navigate = useNavigate();

   const togglePasswordVisibility = () =>
      setIsVisible((prevState) => !prevState);

   async function onSubmit(data: TSignUp) {
      try {
         await authClient.signUp.email(
            {
               email: data.email,
               password: data.password,
               name: data.name,
               callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
            },
            {
               onSuccess: () => {
                  navigate("/dashboard");
                  toast.success("Signed up successfully!");
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

   async function signUpWithGithub() {
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
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
               <div className="flex flex-col items-center gap-2">
                  <Link
                     to="/"
                     className="flex flex-col items-center gap-2 font-medium"
                  >
                     <Logo />
                  </Link>
                  <h1 className="text-xl font-bold">Create your account</h1>
                  <div className="text-center text-sm">
                     Already have an account?{" "}
                     <Link
                        to="/auth/sign-in"
                        className="underline underline-offset-4"
                     >
                        Login
                     </Link>
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="grid gap-3">
                     <Label htmlFor="name">Name</Label>
                     <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="h-10"
                        {...register("name")}
                     />
                     {errors.name && (
                        <p className="text-xs text-destructive">
                           {errors.name.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-3">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="h-10"
                        {...register("email")}
                     />
                     {errors.email && (
                        <p className="text-xs text-destructive">
                           {errors.email.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-3">
                     <Label htmlFor="password">Password</Label>
                     <div className="relative">
                        <Input
                           id="password"
                           type={isVisible ? "text" : "password"}
                           placeholder="yourstrongpassword"
                           className="h-10"
                           {...register("password")}
                        />
                        <button
                           className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                           type="button"
                           onClick={togglePasswordVisibility}
                           aria-label={
                              isVisible ? "Hide password" : "Show password"
                           }
                           aria-pressed={isVisible}
                           aria-controls="password"
                        >
                           {isVisible ? (
                              <EyeOffIcon size={16} aria-hidden="true" />
                           ) : (
                              <EyeIcon size={16} aria-hidden="true" />
                           )}
                        </button>
                     </div>
                     {errors.password && (
                        <p className="text-xs text-destructive">
                           {errors.password.message}
                        </p>
                     )}
                  </div>
                  <Button
                     size="lg"
                     type="submit"
                     className="w-full"
                     disabled={isSubmitting || isLoading}
                  >
                     Sign Up
                     {isSubmitting && (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                        >
                           <path
                              fill="currentColor"
                              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                              opacity="0.25"
                           />
                           <path
                              fill="currentColor"
                              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                           >
                              <animateTransform
                                 attributeName="transform"
                                 dur="0.75s"
                                 repeatCount="indefinite"
                                 type="rotate"
                                 values="0 12 12;360 12 12"
                              />
                           </path>
                        </svg>
                     )}
                  </Button>
               </div>
               <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                     Or
                  </span>
               </div>
               <div className="grid gap-3">
                  <Button
                     variant="outline"
                     size="lg"
                     type="button"
                     className="w-full"
                     onClick={async () => await signUpWithGithub()}
                     disabled={isSubmitting || isLoading}
                  >
                     {isLoading ? (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                        >
                           <path
                              fill="currentColor"
                              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                              opacity="0.25"
                           />
                           <path
                              fill="currentColor"
                              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                           >
                              <animateTransform
                                 attributeName="transform"
                                 dur="0.75s"
                                 repeatCount="indefinite"
                                 type="rotate"
                                 values="0 12 12;360 12 12"
                              />
                           </path>
                        </svg>
                     ) : (
                        <SiGithub />
                     )}
                     Continue with Github
                  </Button>
               </div>
            </div>
         </form>
         <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
         </div>
      </div>
   );
}
