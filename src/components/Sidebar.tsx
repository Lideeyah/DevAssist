import React from "react";
import { FolderOpen, Search, GitBranch, Package, Bug } from "lucide-react";

interface SidebarProps {
   activeTab: string;
   setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
   const tabs = [
      { id: "explorer", icon: FolderOpen, label: "Explorer" },
      { id: "search", icon: Search, label: "Search" },
      { id: "git", icon: GitBranch, label: "Source Control" },
      { id: "debug", icon: Bug, label: "Debug" },
      { id: "extensions", icon: Package, label: "Extensions" },
   ];

   return (
      <div className="w-12 bg-gray-100 dark:bg-[#0D1117] border-r border-gray-200 dark:border-[#30363D] flex flex-col py-2">
         {tabs.map((tab) => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
               className={`p-2 mx-1 rounded-md transition-colors ${
                  activeTab === tab.id
                     ? "bg-blue-600 text-white"
                     : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#262C36]"
               }`}
               title={tab.label}
            >
               <tab.icon className="w-5 h-5" />
            </button>
         ))}
      </div>
   );
};

export default Sidebar;
