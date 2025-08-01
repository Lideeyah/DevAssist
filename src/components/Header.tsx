import React, { useState } from "react";
import {
   Sun,
   Moon,
   Settings,
   CreditCard,
   Globe,
   ChevronDown,
   User,
   LogOut,
} from "lucide-react";
import { User as UserType } from "../App";
import Logo from "../assets/logo-blue.svg"

interface HeaderProps {
   isDarkTheme: boolean;
   setIsDarkTheme: (theme: boolean) => void;
   onShowPricing: () => void;
   onShowOnboarding: () => void;
   onMenuAction: (action: string) => void;
   user: UserType | null;
   currentView: "ide" | "team" | "sme";
}

const Header: React.FC<HeaderProps> = ({
   isDarkTheme,
   setIsDarkTheme,
   onShowPricing,
   onShowOnboarding,
   onMenuAction,
   user,
   currentView,
}) => {
   const [activeMenu, setActiveMenu] = useState<string | null>(null);
   const [showUserMenu, setShowUserMenu] = useState(false);

   const menuItems = {
      file: [
         { label: "New File", action: "new-file", shortcut: "Ctrl+N" },
         {
            label: "New Folder",
            action: "new-folder",
            shortcut: "Ctrl+Shift+N",
         },
         { type: "separator" },
         { label: "Open File...", action: "upload-file", shortcut: "Ctrl+O" },
         {
            label: "Open Folder...",
            action: "upload-folder",
            shortcut: "Ctrl+K Ctrl+O",
         },
         { type: "separator" },
         { label: "Save", action: "save", shortcut: "Ctrl+S" },
         { label: "Save All", action: "save-all", shortcut: "Ctrl+K S" },
         { type: "separator" },
         { label: "Close Tab", action: "close-tab", shortcut: "Ctrl+W" },
      ],
      edit: [
         { label: "Undo", action: "undo", shortcut: "Ctrl+Z" },
         { label: "Redo", action: "redo", shortcut: "Ctrl+Y" },
         { type: "separator" },
         { label: "Cut", action: "cut", shortcut: "Ctrl+X" },
         { label: "Copy", action: "copy", shortcut: "Ctrl+C" },
         { label: "Paste", action: "paste", shortcut: "Ctrl+V" },
         { type: "separator" },
         { label: "Find", action: "find", shortcut: "Ctrl+F" },
         { label: "Replace", action: "replace", shortcut: "Ctrl+H" },
      ],
      view: [
         {
            label: "Command Palette",
            action: "command-palette",
            shortcut: "Ctrl+Shift+P",
         },
         { type: "separator" },
         {
            label: "Explorer",
            action: "toggle-sidebar",
            shortcut: "Ctrl+Shift+E",
         },
         { label: "Search", action: "toggle-search", shortcut: "Ctrl+Shift+F" },
         {
            label: "Source Control",
            action: "toggle-git",
            shortcut: "Ctrl+Shift+G",
         },
         { label: "Debug", action: "toggle-debug", shortcut: "Ctrl+Shift+D" },
         { type: "separator" },
         { label: "Terminal", action: "toggle-terminal", shortcut: "Ctrl+`" },
         {
            label: "AI Assistant",
            action: "toggle-ai",
            shortcut: "Ctrl+Shift+A",
         },
      ],
      ai: [
         { label: "Ask AI", action: "ask-ai", shortcut: "Ctrl+I" },
         {
            label: "Explain Code",
            action: "explain-code",
            shortcut: "Ctrl+Shift+I",
         },
         {
            label: "Generate Tests",
            action: "generate-tests",
            shortcut: "Ctrl+Shift+T",
         },
         {
            label: "Fix Issues",
            action: "fix-issues",
            shortcut: "Ctrl+Shift+F",
         },
         { type: "separator" },
         { label: "Code Review", action: "code-review" },
         { label: "Optimize Code", action: "optimize-code" },
         { label: "Add Comments", action: "add-comments" },
      ],
   };

   const handleLogout = () => {
      localStorage.removeItem("devassist_user");
      window.location.reload();
   };

   const handleMenuClick = (menuName: string) => {
      setActiveMenu(activeMenu === menuName ? null : menuName);
   };

   const handleMenuItemClick = (action: string) => {
      onMenuAction(action);
      setActiveMenu(null);
   };

   const renderDropdownMenu = (menuName: string) => {
      if (activeMenu !== menuName) return null;

      const items = menuItems[menuName as keyof typeof menuItems];

      return (
         <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-[#30363D] rounded-md shadow-lg py-1 min-w-48 z-50">
            {items.map((item, index) => {
               if (item.type === "separator") {
                  return (
                     <div
                        key={index}
                        className="border-t border-gray-200 dark:border-[#30363D] my-1"
                     />
                  );
               }
               return (
                  <button
                     key={index}
                     onClick={() => handleMenuItemClick(item.action ?? "")}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] flex items-center justify-between"
                  >
                     <span>{item.label}</span>
                     {item.shortcut && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                           {item.shortcut}
                        </span>
                     )}
                  </button>
               );
            })}
         </div>
      );
   };

   return (
      <header className="h-12 bg-white dark:bg-[#1C2128] border-b border-gray-200 dark:border-[#30363D] flex items-center justify-between px-4 relative">
         <div className="flex items-center space-x-4">
            <div className="shrink-0 w-20 sm:w-28">
               <img 
                  src={Logo}
                  alt="logo"
                  className="size-full object-contain"
               />
            </div>

            {/* View Switcher */}
            {user && (
               <div className="flex items-center bg-gray-100 dark:bg-[#0D0D0D] rounded-lg p-1">
                  <button
                     onClick={() => onMenuAction("switch-to-ide")}
                     className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        currentView === "ide"
                           ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                           : "text-gray-600 dark:text-gray-400"
                     }`}
                  >
                     IDE
                  </button>
                  {user.userType === "team" && (
                     <button
                        onClick={() => onMenuAction("switch-to-team")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                           currentView === "team"
                              ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                     >
                        Team
                     </button>
                  )}
                  {user.userType === "business" && (
                     <button
                        onClick={() => onMenuAction("switch-to-sme")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                           currentView === "sme"
                              ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                     >
                        Builder
                     </button>
                  )}
               </div>
            )}

            {currentView === "ide" && (
               <nav className="hidden md:flex items-center space-x-1">
                  {Object.keys(menuItems).map((menuName) => (
                     <div key={menuName} className="relative">
                        <button
                           onClick={() => handleMenuClick(menuName)}
                           className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize flex items-center space-x-1 ${
                              activeMenu === menuName
                                 ? "bg-gray-100 dark:bg-[#262C36] text-gray-900 dark:text-white"
                                 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                           }`}
                        >
                           <span>{menuName}</span>
                           <ChevronDown className="w-3 h-3" />
                        </button>
                        {renderDropdownMenu(menuName)}
                     </div>
                  ))}
               </nav>
            )}
         </div>

         <div className="flex items-center space-x-2">
            {user && (
               <>
                  <div className="hidden md:flex items-center space-x-3 px-3 py-1 bg-gray-100 dark:bg-[#0D0D0D] rounded-lg">
                     <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                           Plan:{" "}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                           {user.subscription.plan}
                        </span>
                     </div>
                     <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                           AI:{" "}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                           {user.subscription.aiUsageCount}/
                           {user.subscription.aiUsageLimit}
                        </span>
                     </div>
                  </div>

                  <button
                     onClick={onShowOnboarding}
                     className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
                     title="Africa Setup"
                  >
                     <Globe className="w-4 h-4 text-[#F59E0B]" />
                  </button>
               </>
            )}

            <button
               onClick={onShowPricing}
               className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
               title="Upgrade to Pro"
            >
               <CreditCard className="w-4 h-4 text-[#2563EB]" />
            </button>

            <button
               onClick={() => setIsDarkTheme(!isDarkTheme)}
               className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
            >
               {isDarkTheme ? (
                  <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
               ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
               )}
            </button>

            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors">
               <Settings className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>

            {/* User Menu */}
            {user && (
               <div className="relative">
                  <button
                     onClick={() => setShowUserMenu(!showUserMenu)}
                     className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
                  >
                     <div className="w-8 h-8 bg-gradient-to-r from-[#6C33FF] to-[#00A676] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                     </div>
                     <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>

                  {showUserMenu && (
                     <div className="absolute top-full right-0 mt-1 bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-[#30363D] rounded-md shadow-lg py-1 min-w-48 z-50">
                        <div className="px-3 py-2 border-b border-gray-200 dark:border-[#30363D]">
                           <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                           </p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                           </p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {user.userType} • {user.country} • {user.currency}
                           </p>
                        </div>
                        <button
                           onClick={() => {
                              setShowUserMenu(false);
                              onShowPricing();
                           }}
                           className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] flex items-center space-x-2"
                        >
                           <CreditCard className="w-4 h-4" />
                           <span>Billing & Plans</span>
                        </button>
                        <button
                           onClick={() => {
                              setShowUserMenu(false);
                              onShowOnboarding();
                           }}
                           className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] flex items-center space-x-2"
                        >
                           <Settings className="w-4 h-4" />
                           <span>Settings</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-[#30363D] my-1" />
                        <button
                           onClick={handleLogout}
                           className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#262C36] flex items-center space-x-2"
                        >
                           <LogOut className="w-4 h-4" />
                           <span>Sign Out</span>
                        </button>
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* Overlay to close menu when clicking outside */}
         {(activeMenu || showUserMenu) && (
            <div
               className="fixed inset-0 z-40"
               onClick={() => {
                  setActiveMenu(null);
                  setShowUserMenu(false);
               }}
            />
         )}
      </header>
   );
};

export default Header;
