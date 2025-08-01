import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CodeEditor from "./components/CodeEditor";
import AIAssistant from "./components/AIAssistant";
import Terminal from "./components/Terminal";
import PricingModal from "./components/PricingModal";
import OnboardingModal from "./components/OnboardingModal";
import FileExplorer from "./components/FileExplorer";
import SearchPanel from "./components/SearchPanel";
import GitPanel from "./components/GitPanel";
import DebugPanel from "./components/DebugPanel";
import ExtensionsPanel from "./components/ExtensionsPanel";
import AuthModal from "./components/AuthModal";
import UserTypeSelection from "./components/UserTypeSelection";
import CountrySelection from "./components/CountrySelection";
import AIModelSelection from "./components/AIModelSelection";
import TeamDashboard from "./components/TeamDashboard";
import SMEBuilder from "./components/SMEBuilder";
import UsageTracker from "./components/UsageTracker";
import { userType } from "./types";

export interface FileItem {
   id: string;
   name: string;
   type: "file" | "folder";
   path: string;
   content?: string;
   language?: string;
   children?: FileItem[];
   isOpen?: boolean;
   unsaved?: boolean;
}

export interface Tab {
   id: string;
   name: string;
   path: string;
   language: string;
   content: string;
   unsaved: boolean;
}

export interface User {
   id: string;
   email: string;
   name: string;
   userType: userType;
   country: string;
   currency: string;
   aiModel: string;
   subscription: {
      plan: "free" | "starter" | "pro" | "business";
      aiUsageCount: number;
      aiUsageLimit: number;
   };
}

function App() {
   const [isDarkTheme, setIsDarkTheme] = useState(true);
   const [showPricing, setShowPricing] = useState(false);
   const [showOnboarding, setShowOnboarding] = useState(false);
   const [showAuth, setShowAuth] = useState(false);
   const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
   const [showCountrySelection, setShowCountrySelection] = useState(false);
   const [showAIModelSelection, setShowAIModelSelection] = useState(false);
   const [activeTab, setActiveTab] = useState<string | null>(null);
   const [showTerminal, setShowTerminal] = useState(false);
   const [aiPanelOpen, setAiPanelOpen] = useState(true);
   const [sidebarActiveTab, setSidebarActiveTab] = useState("explorer");
   const [terminalHeight] = useState(250);
   const [currentView, setCurrentView] = useState<"ide" | "team" | "sme">(
      "ide"
   );

   const fileInputRef = useRef<HTMLInputElement>(null);
   const folderInputRef = useRef<HTMLInputElement>(null);

   // User authentication state
   const [user, setUser] = useState<User | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Check for existing session on app load
   useEffect(() => {
      const savedUser = localStorage.getItem("devassist_user");
      if (savedUser) {
         const userData = JSON.parse(savedUser);
         setUser(userData);
         setIsAuthenticated(true);
         setCurrentView(
            userData.userType === "team"
               ? "team"
               : userData.userType === "business"
               ? "sme"
               : "ide"
         );
      } else {
         setShowAuth(true);
      }
   }, []);

   const [files, setFiles] = useState<FileItem[]>([
      {
         id: "1",
         name: "src",
         type: "folder",
         path: "/src",
         isOpen: true,
         children: [
            {
               id: "2",
               name: "App.tsx",
               type: "file",
               path: "/src/App.tsx",
               language: "typescript",
               content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Welcome to DevAssist</h1>\n      <p>Start building amazing things!</p>\n    </div>\n  );\n}\n\nexport default App;`,
            },
            {
               id: "3",
               name: "components",
               type: "folder",
               path: "/src/components",
               isOpen: false,
               children: [
                  {
                     id: "4",
                     name: "Header.tsx",
                     type: "file",
                     path: "/src/components/Header.tsx",
                     language: "typescript",
                     content: `import React from 'react';\n\nconst Header = () => {\n  return (\n    <header>\n      <h1>DevAssist Header</h1>\n    </header>\n  );\n};\n\nexport default Header;`,
                  },
               ],
            },
         ],
      },
      {
         id: "5",
         name: "package.json",
         type: "file",
         path: "/package.json",
         language: "json",
         content: `{\n  "name": "devassist-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "typescript": "^5.0.0"\n  }\n}`,
      },
   ]);

   const [tabs, setTabs] = useState<Tab[]>([]);

   const handleAuthSuccess = () => {
      setIsAuthenticated(true);
      setShowAuth(false);
      setShowUserTypeSelection(true);
   };

   const handleUserTypeSelection = (
      userType: userType
   ) => {
      setUser((prev) => (prev ? { ...prev, userType } : null));
      setShowUserTypeSelection(false);
      setShowCountrySelection(true);
   };

   const handleCountrySelection = (country: string, currency: string) => {
      setUser((prev) => (prev ? { ...prev, country, currency } : null));
      setShowCountrySelection(false);
      setShowAIModelSelection(true);
   };

   const handleAIModelSelection = (aiModel: string) => {
      const updatedUser = {
         ...user!,
         aiModel,
         subscription: {
            plan: "free" as const,
            aiUsageCount: 0,
            aiUsageLimit: 5,
         },
      };
      setUser(updatedUser);
      localStorage.setItem("devassist_user", JSON.stringify(updatedUser));
      setShowAIModelSelection(false);
      setCurrentView(
         updatedUser.userType === "team"
            ? "team"
            : updatedUser.userType === "business"
            ? "sme"
            : "ide"
      );
      setShowOnboarding(true);
   };

   const openFile = (file: FileItem) => {
      if (file.type === "file") {
         const existingTab = tabs.find((tab) => tab.path === file.path);
         if (existingTab) {
            setActiveTab(existingTab.id);
         } else {
            const newTab: Tab = {
               id: file.id,
               name: file.name,
               path: file.path,
               language: file.language || "text",
               content: file.content || "",
               unsaved: false,
            };
            setTabs((prev) => [...prev, newTab]);
            setActiveTab(newTab.id);
         }
      }
   };

   const closeTab = (tabId: string) => {
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      if (activeTab === tabId) {
         const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
         setActiveTab(
            remainingTabs.length > 0
               ? remainingTabs[remainingTabs.length - 1].id
               : null
         );
      }
   };

   const updateTabContent = (tabId: string, content: string) => {
      setTabs((prev) =>
         prev.map((tab) =>
            tab.id === tabId ? { ...tab, content, unsaved: true } : tab
         )
      );
   };

   const saveTab = (tabId: string) => {
      setTabs((prev) =>
         prev.map((tab) =>
            tab.id === tabId ? { ...tab, unsaved: false } : tab
         )
      );
   };

   const createNewFile = () => {
      const fileName = prompt("Enter file name:");
      if (fileName) {
         const newFile: FileItem = {
            id: Date.now().toString(),
            name: fileName,
            type: "file",
            path: `/${fileName}`,
            language: fileName.split(".").pop() || "text",
            content: "",
         };
         setFiles((prev) => [...prev, newFile]);
         openFile(newFile);
      }
   };

   const createNewFolder = () => {
      const folderName = prompt("Enter folder name:");
      if (folderName) {
         const newFolder: FileItem = {
            id: Date.now().toString(),
            name: folderName,
            type: "folder",
            path: `/${folderName}`,
            children: [],
            isOpen: false,
         };
         setFiles((prev) => [...prev, newFolder]);
      }
   };

   const uploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFiles = event.target.files;
      if (uploadedFiles) {
         Array.from(uploadedFiles).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
               const content = e.target?.result as string;
               const newFile: FileItem = {
                  id: Date.now().toString() + Math.random().toString(),
                  name: file.name,
                  type: "file",
                  path: `/${file.name}`,
                  language: file.name.split(".").pop() || "text",
                  content,
               };
               setFiles((prev) => [...prev, newFile]);
            };
            reader.readAsText(file);
         });
      }
   };

   const handleMenuAction = (action: string) => {
      switch (action) {
         case "new-file":
            createNewFile();
            break;
         case "new-folder":
            createNewFolder();
            break;
         case "upload-file":
            fileInputRef.current?.click();
            break;
         case "upload-folder":
            folderInputRef.current?.click();
            break;
         case "save":
            if (activeTab) {
               saveTab(activeTab);
            }
            break;
         case "save-all":
            tabs.forEach((tab) => {
               if (tab.unsaved) {
                  saveTab(tab.id);
               }
            });
            break;
         case "close-tab":
            if (activeTab) {
               closeTab(activeTab);
            }
            break;
         case "toggle-terminal":
            setShowTerminal(!showTerminal);
            break;
         case "toggle-ai":
            setAiPanelOpen(!aiPanelOpen);
            break;
         case "toggle-sidebar":
            setSidebarActiveTab(
               sidebarActiveTab === "explorer" ? "" : "explorer"
            );
            break;
         case "switch-to-ide":
            setCurrentView("ide");
            break;
         case "switch-to-team":
            setCurrentView("team");
            break;
         case "switch-to-sme":
            setCurrentView("sme");
            break;
      }
   };

   const renderSidebarContent = () => {
      switch (sidebarActiveTab) {
         case "explorer":
            return (
               <FileExplorer
                  files={files}
                  setFiles={setFiles}
                  openFile={openFile}
                  onMenuAction={handleMenuAction}
               />
            );
         case "search":
            return <SearchPanel files={files} openFile={openFile} />;
         case "git":
            return <GitPanel />;
         case "debug":
            return <DebugPanel />;
         case "extensions":
            return <ExtensionsPanel />;
         default:
            return null;
      }
   };

   const renderMainContent = () => {
      switch (currentView) {
         case "team":
            return <TeamDashboard user={user} onSwitchView={setCurrentView} />;
         case "sme":
            return <SMEBuilder user={user} onSwitchView={setCurrentView} />;
         default:
            return (
               <>
                  <div className="flex flex-1 overflow-hidden">
                     {sidebarActiveTab && (
                        <div className="w-80 bg-white dark:bg-[#161B22] border-r border-gray-200 dark:border-[#30363D] flex">
                           <Sidebar
                              activeTab={sidebarActiveTab}
                              setActiveTab={setSidebarActiveTab}
                           />
                           <div className="flex-1 overflow-hidden">
                              {renderSidebarContent()}
                           </div>
                        </div>
                     )}

                     <div className="flex flex-1 flex-col min-w-0">
                        <CodeEditor
                           tabs={tabs}
                           activeTab={activeTab}
                           setActiveTab={setActiveTab}
                           closeTab={closeTab}
                           updateTabContent={updateTabContent}
                           showTerminal={showTerminal}
                           setShowTerminal={setShowTerminal}
                           onMenuAction={handleMenuAction}
                        />

                        {showTerminal && (
                           <div
                              className="border-t border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22]"
                              style={{ height: terminalHeight }}
                           >
                              <Terminal />
                           </div>
                        )}
                     </div>

                     {user && aiPanelOpen && (
                        <AIAssistant
                           user={user}
                           setUser={setUser}
                           onClose={() => setAiPanelOpen(false)}
                        />
                     )}
                  </div>
               </>
            );
      }
   };

   if (!isAuthenticated) {
      return (
         <div
            className={`${
               isDarkTheme ? "dark" : ""
            } h-screen bg-gray-50 dark:bg-[#0D0D0D]`}
         >
            <div className="text-gray-900 dark:text-gray-100 h-full">
               {showAuth && (
                  <AuthModal
                     onSuccess={handleAuthSuccess}
                     onClose={() => setShowAuth(false)}
                  />
               )}
            </div>
         </div>
      );
   }

   return (
      <div
         className={`${
            isDarkTheme ? "dark" : ""
         } h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0D0D0D]`}
      >
         <div className="text-gray-900 dark:text-gray-100 h-full flex flex-col">
            <Header
               isDarkTheme={isDarkTheme}
               setIsDarkTheme={setIsDarkTheme}
               onShowPricing={() => setShowPricing(true)}
               onShowOnboarding={() => setShowOnboarding(true)}
               onMenuAction={handleMenuAction}
               user={user}
               currentView={currentView}
            />

            {renderMainContent()}
         </div>

         {/* Usage Tracker */}
         {user && (
            <UsageTracker
               user={user}
               setUser={setUser}
               onUpgrade={() => setShowPricing(true)}
            />
         )}

         {/* Hidden file inputs */}
         <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={uploadFiles}
         />
         <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            onChange={uploadFiles}
         />

         {/* Modals */}
         {showUserTypeSelection && (
            <UserTypeSelection
               onSelect={handleUserTypeSelection}
               onClose={() => setShowUserTypeSelection(false)}
            />
         )}

         {showCountrySelection && (
            <CountrySelection
               onSelect={handleCountrySelection}
               onClose={() => setShowCountrySelection(false)}
            />
         )}

         {showAIModelSelection && (
            <AIModelSelection
               onSelect={handleAIModelSelection}
               onClose={() => setShowAIModelSelection(false)}
            />
         )}

         {showPricing && (
            <PricingModal user={user} onClose={() => setShowPricing(false)} />
         )}

         {showOnboarding && (
            <OnboardingModal onClose={() => setShowOnboarding(false)} />
         )}
      </div>
   );
}

export default App;
