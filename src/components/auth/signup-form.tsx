import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import Logo from "../logo";
import { Icon } from "@iconify/react";

export function SignUpForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <form>
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
                     <Link to="/auth/sign-in" className="underline underline-offset-4">
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
                     />
                  </div>
                  <div className="grid gap-3">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="h-10"
                     />
                  </div>
                  <div className="grid gap-3">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="yourstrongpassword"
                        className="h-10"
                     />
                  </div>
                  <Button size="lg" type="submit" className="w-full">
                     Sign Up
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
                  >
                     <Icon icon="hugeicons:github" width="24" height="24" />
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
