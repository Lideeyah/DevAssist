import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { OnboardState } from "@/types/onboarding";
import { Plus, Store } from "lucide-react";
import { useEffect, useState } from "react";

export default function SubHeading(): JSX.Element {
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState("Your Business");

  useEffect(() => {
    // Load onboarding data from localStorage
    const loadOnboardingData = () => {
      try {
        const storedData = localStorage.getItem("onboard:v1");
        if (storedData) {
          const onboardingData: OnboardState = JSON.parse(storedData);
          setSelectedPath(onboardingData.path?.selected || "Your Business");
        } else if (user?.email) {
          // Try to load from user-specific backup
          const userOnboardingDataKey = `onboarding_data_${user.email.toLowerCase()}`;
          const userData = localStorage.getItem(userOnboardingDataKey);
          if (userData) {
            const onboardingData: OnboardState = JSON.parse(userData);
            setSelectedPath(onboardingData.path?.selected || "Your Business");
            // Restore to main onboard:v1 for future use
            localStorage.setItem("onboard:v1", userData);
          }
        }
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    };

    loadOnboardingData();
  }, [user]);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="">
        <h3 className="text-2xl font-medium normal-case">Welcome back, {user ? user.username : "user"}!</h3>
        <div className="flex items-center gap-3">
          <Store size={16} />
          <span className="text-lg font-normal text-muted-foreground">{selectedPath}</span>
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
