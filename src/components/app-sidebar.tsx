import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { DashboardLogo } from "./dashboard-logo";
import { useAuth } from "@/hooks/use-auth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      isActive: true,
      icon: "solar:code-scan-bold-duotone",
    },
    {
      title: "SME Builder",
      url: "/dashboard/prompt",
      icon: "solar:chat-square-code-bold-duotone",
    },
    {
      title: "IDE",
      url: "/ide",
      icon: "solar:code-circle-bold-duotone",
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
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: "solar:code-scan-bold-duotone",
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: "solar:code-scan-bold-duotone",
    },
    {
      name: "Travel",
      url: "#",
      icon: "solar:code-scan-bold-duotone",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
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
