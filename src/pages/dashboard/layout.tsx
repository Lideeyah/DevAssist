import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
// import { dashboardHeader } from "@/components/dashboard/dashboardHeader";
import { Bell } from "lucide-react";

export default function DashboardLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between pr-4 overflow-hidden border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>
          {/* <div className="">
            <dashboardHeader />
          </div> */}

          <div className="flex justify-end">
            <div className="flex items-center gap-4">
              <Bell className="text-xl cursor-pointer" />
              <div className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center bg-white"></div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
