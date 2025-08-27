import { useState } from "react";
import { AlignJustify } from "lucide-react";
// import { AppSidebar } from "../app-sidebar";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
// import { Separator } from "@radix-ui/react-dropdown-menu";

interface MenuBarProps {
  isAuthenticated: boolean;
  user: any;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onSaveFile: () => void;
  onSaveAllFiles: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export default function MenuBar({
  isAuthenticated,
  user,
  onNewFile,
  onNewFolder,
  onOpenFile,
  onOpenFolder,
  onSaveFile,
  onSaveAllFiles,
  onLogin,
  onLogout,
}: MenuBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-8 flex items-center px-4 gap-4 border-b border-white text-sm bg-gray-850">
      <div className="">
        <div className="cursor-pointer">
          <AlignJustify size={17} />
        </div>
      </div>

      {/* <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex w-full bg-background justify-between pr-4 overflow-hidden border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </div> */}

      <span className="font-bold text-blue-400">DevAssist</span>

      {/* File Menu */}
      <div className="relative group ml-6">
        <span onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer hover:text-blue-400 transition-colors duration-200">
          File
        </span>

        {menuOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-gray-800 border border-white rounded shadow-lg z-10">
            <div className="py-1">
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onNewFile}>
                New File
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onNewFolder}>
                New Folder
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onOpenFile}>
                Open File
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onOpenFolder}>
                Open Folder
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onSaveFile}>
                Save
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onSaveAllFiles}>
                Save All
              </div>
              <hr className="border-white my-1" />
              {isAuthenticated ? (
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onLogout}>
                  Logout
                </div>
              ) : (
                <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onLogin}>
                  Login
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">Edit</span>
      <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">View</span>
      <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">AI</span>

      {isAuthenticated && user && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">Welcome, {user.username}</span>
        </div>
      )}
    </div>
  );
}
