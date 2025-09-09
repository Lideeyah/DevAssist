// import { useState } from "react";
// import { AlignJustify } from "lucide-react";
// import { AppSidebar } from "../app-sidebar";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
// import { Separator } from "@radix-ui/react-dropdown-menu";
import logo from "../../../assets/logo-blue.svg";

interface MenuBarProps {
  isAuthenticated: boolean;
  user: any;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onSaveFile: () => void;
  onSaveAllFiles: () => void;
  // onLogin: () => void;
  onLogout: () => void;
  setMenuOpen: (open: boolean) => void;
  menuOpen: boolean;
}

export default function MenuBar({
  isAuthenticated,
  user,
  // onNewFile,
  // onNewFolder,
  // onOpenFile,
  // onOpenFolder,
  // onSaveFile,
  // onSaveAllFiles,
  // onLogin,
  // onLogout,
  setMenuOpen,
  menuOpen,
}: MenuBarProps) {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-8 flex items-center gap-4 justify-between w-full text-sm">
      {/* File Menu */}
      <div className="relative group flex items-center gap-6">
        <img src={logo} alt="logo image" className="w-24 h-24 object-contain" />
        <span onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer hover:text-blue-400 transition-colors duration-200">
          File
        </span>

        <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">Edit</span>
        <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">View</span>
        <span className="ml-4 cursor-pointer hover:text-blue-400 transition-colors duration-200">AI</span>
      </div>

      {isAuthenticated && user && (
        <div className="ml-auto flex items-center gap-2 justify-end w-full">
          <span className="text-xs text-gray-400">Welcome, {user.username}</span>
        </div>
      )}
    </div>
  );
}
