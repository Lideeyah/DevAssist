import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

export function NavUser({
   user,
}: {
   user: {
      name: string;
      email: string;
      avatar: string;
   };
}) {
   const { isMobile } = useSidebar();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg"
                  >
                     <Avatar className="h-8 w-8 rounded-sm">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-md">
                           {user.name.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                           {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                     </div>
                     <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="p-0 font-normal">
                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-sm">
                           <AvatarImage src={user.avatar} alt={user.name} />
                           <AvatarFallback className="rounded-md">
                              {user.name.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-medium">
                              {user.name}
                           </span>
                           <span className="truncate text-xs">
                              {user.email}
                           </span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <Icon
                           icon="solar:medal-star-circle-bold-duotone"
                           width="24"
                           height="24"
                        />
                        Upgrade to Pro
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <Icon
                           icon="solar:verified-check-bold-duotone"
                           width="24"
                           height="24"
                        />
                        Account
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Icon
                           icon="solar:card-2-bold-duotone"
                           width="24"
                           height="24"
                        />
                        Billing
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Icon
                           icon="solar:bell-bing-bold-duotone"
                           width="24"
                           height="24"
                        />
                        Notifications
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     variant="destructive"
                     className="cursor-pointer"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                     >
                        <path
                           fill="currentColor"
                           d="M12 20a8 8 0 1 1 0-16z"
                           opacity="0.5"
                        />
                        <path
                           fill="currentColor"
                           fillRule="evenodd"
                           d="M16.47 8.47a.75.75 0 0 0 0 1.06l1.72 1.72H10a.75.75 0 0 0 0 1.5h8.19l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0"
                           clipRule="evenodd"
                        />
                     </svg>
                     Logout
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
