import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, ChevronDown, LayoutGrid, Settings } from "lucide-react";
import { FaBolt, FaGithub } from "react-icons/fa";
import { useAuth } from "@/hooks/use-auth";
import { Link, Outlet, useLocation } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/user-dropdow";
import { useEffect, useState } from "react";

export default function DashboardLayout(): JSX.Element {
  const { user } = useAuth();
  const location = useLocation();
  const pathName = location.pathname;
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const userOnboardingKey = `onboarding_${user.email.toLowerCase()}`;
      const storedStatus = localStorage.getItem(userOnboardingKey);
      const hasCompletedOnboarding = storedStatus === "true";

      if (!hasCompletedOnboarding) {
        window.location.href = "/onboarding";
      } else {
        setIsCheckingOnboarding(false);
      }
    } else {
      setIsCheckingOnboarding(false);
    }
  }, [user]);

  if (isCheckingOnboarding) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex w-full bg-background justify-between pr-4 overflow-hidden border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>

          {pathName !== "/dashboard/sme" ? (
            <div className="flex">
              <div className="flex items-center justify-end gap-4">
                <Bell className="text-xl cursor-pointer" />
                <div className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center bg-white overflow-hidden">
                  {!user ? (
                    <div className="flex gap-4">
                      <Button asChild variant="outline" size={"lg"}>
                        <Link to="/auth/sign-up">Sign Up</Link>
                      </Button>
                      <Button asChild size={"lg"}>
                        <Link to="/auth/sign-in">Sign In</Link>
                      </Button>
                    </div>
                  ) : (
                    <UserDropdown user={user} align="end" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end w-full gap-4">
              <div className="bg-neutral-700 rounded-sm p-2 hover:scale-95 transition-all duration-200 cursor-pointer">
                <Settings size={17} />
              </div>
              <div className="hover:scale-95 transition-all duration-200 cursor-pointer">
                <FaGithub size={20} />
              </div>
              <div className="border rounded-sm p-2 hover:scale-95 transition-all duration-200 cursor-pointer">
                <FaBolt className="text-green-600" size={17} />
              </div>
              <div className="bg-neutral-800 hover:scale-95 transition-all duration-200 cursor-pointer p-2 rounded-sm flex items-center gap-3">
                <LayoutGrid size={17} />
                <span>Integration</span>
                <ChevronDown size={17} />
              </div>
              <div className="flex items-center hover:scale-95 transition-all duration-200 cursor-pointer bg-blue-500 rounded-sm p-2 gap-3">
                Publish
                <ChevronDown size={17} />
              </div>
            </div>
          )}
        </header>

        <main className="p-6 z-10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
