import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export default function Layout() {
   return (
      <>
         <Outlet />
         <Toaster richColors closeButton position="top-center"/>
      </>
   );
}
