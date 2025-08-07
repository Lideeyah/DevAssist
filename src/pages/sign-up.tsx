import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUp() {
   return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
         <div className="w-full max-w-sm">
            <SignUpForm />
         </div>
      </div>
   );
}
