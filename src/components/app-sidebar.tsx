import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { DashboardLogo } from "./dashboard-logo";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    if (user) {
      // Get the selected path from onboarding data
      const getSelectedPath = () => {
        try {
          // First try main onboarding data
          const storedData = localStorage.getItem("onboard:v1");
          if (storedData) {
            const onboardingData = JSON.parse(storedData);
            const path = onboardingData.path?.selected;

            // Map display names to keys
            if (path === "Businesses/SMEs") return "business_owner";
            if (path === "Developers") return "developer";
            if (path === "Teams") return "team";

            return path; // return as-is if it's already a key
          }

          // Then try user-specific backup data
          if (user?.email) {
            const userOnboardingDataKey = `onboarding_data_${user.email.toLowerCase()}`;
            const userData = localStorage.getItem(userOnboardingDataKey);
            if (userData) {
              const onboardingData = JSON.parse(userData);
              const path = onboardingData.path?.selected;

              // Map display names to keys
              if (path === "Businesses/SMEs") return "business_owner";
              if (path === "Developers") return "developer";
              if (path === "Teams") return "team";

              return path;
            }
          }
        } catch (error) {
          console.error("Error loading onboarding path:", error);
        }
        return null;
      };

      const selectedPath = getSelectedPath();
      console.log("Selected path for navigation:", selectedPath);

      // Base navigation items (always shown)
      const baseNavItems = [
        {
          title: "Dashboard",
          url: "/dashboard/overview",
          isActive: true,
          icon: "solar:code-scan-bold-duotone",
        },
        {
          title: "Documentation",
          url: "/dashboard/documentation",
          icon: "solar:documents-bold-duotone",
        },
        {
          title: "Deployment",
          url: "/dashboard/deployment",
          icon: "solar:rocket-2-bold-duotone",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: "solar:settings-bold-duotone",
        },
      ];

      // Start with base items
      const finalNavItems = [...baseNavItems];

      // Add path-specific items ONLY if a valid path is selected
      if (selectedPath === "developer" || selectedPath === "team") {
        // Show IDE for developers/teams
        finalNavItems.splice(1, 0, {
          title: "IDE",
          url: "/ide",
          icon: "solar:code-circle-bold-duotone",
        });
      } else if (selectedPath === "business_owner") {
        // Show SME Builder for business owners
        finalNavItems.splice(1, 0, {
          title: "SME Builder",
          url: "/dashboard/sme",
          icon: "solar:chat-square-code-bold-duotone",
        });
      }
      // If selectedPath is null or undefined, don't add any path-specific items

      setNavItems(finalNavItems);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-accent !p-0 mt-3 mx-2 rounded-lg">
        <DashboardLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: `https://api.dicebear.com/9.x/dylan/svg?seed=T${user.username}`,
            email: user.email,
            name: user.username,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
