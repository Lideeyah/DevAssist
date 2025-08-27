import {
   SidebarGroup,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

export function NavMain({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon?: string;
      isActive?: boolean;
      items?: {
         title: string;
         url: string;
      }[];
   }[];
}) {
   return (
      <SidebarGroup>
         <SidebarMenu>
            {items.map((item) => (
               <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                     <Link to={item.url}>
                        {item.icon && (
                           <Icon icon={item.icon} width="24" height="24" />
                        )}
                        <span>{item.title}</span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
         </SidebarMenu>
      </SidebarGroup>
   );
}
