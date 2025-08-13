import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import Logo from "../logo";
import { Icon } from "@iconify/react";
import { SiGithub } from "react-icons/si"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignIn, TSignIn } from "@/validators/sign-in";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function LoginForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<TSignIn>({
      resolver: zodResolver(SignIn),
   });

   const [isVisible, setIsVisible] = useState(false);

   const navigate = useNavigate();

   const togglePasswordVisibility = () =>
      setIsVisible((prevState) => !prevState);

   async function onSubmit(data: TSignIn) {
      try {
         const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
         });

         if (error) {
            toast.error(error.message);
            console.log(error);

            return;
         }

         navigate("/");

         toast.success("Signed in successfully!");
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
                  <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                  <div className="text-center text-sm">
                     Don&apos;t have an account?{" "}
                     <Link
                        to="/auth/sign-up"
                        className="underline underline-offset-4"
                     >
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
                        className="h-10"
                        {...register("email")}
                     />
                     {errors.email && (
                        <p className="text-xs text-destructive">
                           {errors.email.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-2">
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
                     disabled={isSubmitting}
                  >
                     Login
                     {isSubmitting && (
                        <Icon
                           icon="svg-spinners:bars-fade"
                           width="24"
                           height="24"
                        />
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
                     disabled={isSubmitting}
                  >
                     <SiGithub />
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
