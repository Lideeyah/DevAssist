import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoSvg from"@/assets/logo.svg"

export function DashboardLogo() {
   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <SidebarMenuButton
               size="lg"
               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg"
            >
               <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                  <img src={LogoSvg} alt="logo " className="size-6" />
               </div>
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">DevAssist</span>
                  <span className="truncate text-xs">Premium</span>
               </div>
            </SidebarMenuButton>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
