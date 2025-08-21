import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Link } from "react-router";
import { User } from "@/types/auth";

interface UserDropdownProps {
   user: User;
   align?: "center" | "start" | "end";
}

export default function UserDropdown({
   align = "start",
   user,
}: UserDropdownProps) {
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   async function signOut() {
      setIsLoggingOut(true);
      await authClient.signOut({
         fetchOptions: {
            onError: () => {
               toast.error("Somethig went wrong!");
            },
         },
      });
      setIsLoggingOut(false);
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="cursor-pointer">
            <Avatar className="size-10">
               <AvatarImage
                  src={
                     `https://api.dicebear.com/9.x/dylan/svg?seed=${user.username}`
                  }
               />
               <AvatarFallback className="font-medium">
                  {user.username.charAt(0)}
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent
            align={align}
            className="w-[280px] mt-2 rounded-lg"
         >
            <div className="p-1 flex items-center gap-2">
               <Avatar className="size-12">
                  <AvatarImage
                     src={
                        `https://api.dicebear.com/9.x/dylan/svg?seed=${user.username}`
                     }
                  />
                  <AvatarFallback className="font-medium">
                     {user.username.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <div className="grid">
                  <p className="font-medium">{user.username}</p>
                  <span className="text-sm text-muted-foreground">
                     {user.email}
                  </span>
               </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
               <Link to="/dashboard" className="flex items-center gap-2">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                  >
                     <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5.5 15.5c0-.943 0-1.414.293-1.707S6.557 13.5 7.5 13.5h1c.943 0 1.414 0 1.707.293s.293.764.293 1.707v1c0 .943 0 1.414-.293 1.707s-.764.293-1.707.293c-1.414 0-2.121 0-2.56-.44c-.44-.439-.44-1.146-.44-2.56Zm0-7c0-1.414 0-2.121.44-2.56c.439-.44 1.146-.44 2.56-.44c.943 0 1.414 0 1.707.293s.293.764.293 1.707v1c0 .943 0 1.414-.293 1.707s-.764.293-1.707.293h-1c-.943 0-1.414 0-1.707-.293S5.5 9.443 5.5 8.5Zm8 7c0-.943 0-1.414.293-1.707s.764-.293 1.707-.293h1c.943 0 1.414 0 1.707.293s.293.764.293 1.707c0 1.414 0 2.121-.44 2.56c-.439.44-1.146.44-2.56.44c-.943 0-1.414 0-1.707-.293s-.293-.764-.293-1.707zm0-8c0-.943 0-1.414.293-1.707S14.557 5.5 15.5 5.5c1.414 0 2.121 0 2.56.44c.44.439.44 1.146.44 2.56c0 .943 0 1.414-.293 1.707s-.764.293-1.707.293h-1c-.943 0-1.414 0-1.707-.293S13.5 9.443 13.5 8.5z" />
                        <path
                           stroke-linecap="round"
                           d="M22 14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22m-4 0c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14m8-12C6.229 2 4.343 2 3.172 3.172S2 6.229 2 10m12-8c3.771 0 5.657 0 6.828 1.172S22 6.229 22 10"
                           opacity="0.5"
                        />
                     </g>
                  </svg>
                  Dashboard
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={async () => signOut()}
               variant="destructive"
               className="cursor-pointer"
            >
               {isLoggingOut ? (
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                  >
                     <path
                        fill="currentColor"
                        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                        opacity="0.25"
                     />
                     <path
                        fill="currentColor"
                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                     >
                        <animateTransform
                           attributeName="transform"
                           dur="0.75s"
                           repeatCount="indefinite"
                           type="rotate"
                           values="0 12 12;360 12 12"
                        />
                     </path>
                  </svg>
               ) : (
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
               )}
               Logout
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
