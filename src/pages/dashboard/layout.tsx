import { Outlet, useLocation } from "react-router";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, ChevronDown, LayoutGrid, Settings } from "lucide-react";
import { FaBolt, FaGithub } from "react-icons/fa";

export default function DashboardLayout(): JSX.Element {
   const location = useLocation();
   const pathName = location.pathname;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex fixed w-[81%] top-0 z-[9999] bg-background justify-between pr-4 overflow-hidden border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>

          {pathName !== "/dashboard/IDE" ? (
            <div className="flex w-full">
              <div className="flex items-center justify-end gap-4">
                <Bell className="text-xl cursor-pointer" />
                <div className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center bg-white"></div>
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

            <main className="p-6 mt-16 z-10">
               <Outlet />
            </main>
         </SidebarInset>
      </SidebarProvider>
   );
}
