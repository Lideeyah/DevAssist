import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { OnboardState } from "@/types/onboarding";
import { Plus, Store } from "lucide-react";

export default function SubHeading(): JSX.Element {
   const { user } = useAuth();
   const onboardingData: OnboardState = JSON.parse(
      localStorage.getItem("onboard:v1") ?? "{}"
   );

   return (
      <div className="w-full flex items-center justify-between">
         <div className="">
            <h3 className="text-2xl font-medium normal-case">
               Welcome back, {user ? user.username : "user"}!
            </h3>
            <div className="flex items-center gap-3">
               <Store size={16} />
               <span className="text-lg font-normal text-muted-foreground">
                  {onboardingData.path.selected}
               </span>
            </div>
         </div>

         <div className="">
            <Button variant="default">
               <Plus size={16} />
               Create New Project
            </Button>
         </div>
      </div>
   );
}
