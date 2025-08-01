import React, { useState, useRef, useEffect } from "react";
import {
   X,
   Play,
   Terminal as TerminalIcon,
   Sparkles,
   Save,
} from "lucide-react";
import { Tab } from "../App";

interface CodeEditorProps {
   tabs: Tab[];
   activeTab: string | null;
   setActiveTab: (tabId: string) => void;
   closeTab: (tabId: string) => void;
   updateTabContent: (tabId: string, content: string) => void;
   showTerminal: boolean;
   setShowTerminal: (show: boolean) => void;
   onMenuAction: (action: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
   tabs,
   activeTab,
   setActiveTab,
   closeTab,
   updateTabContent,
   showTerminal,
   setShowTerminal,
   onMenuAction,
}) => {
   const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      tabId: string;
   } | null>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const currentTab = tabs.find((tab) => tab.id === activeTab);

   const handleTabContextMenu = (e: React.MouseEvent, tabId: string) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, tabId });
   };

   const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (activeTab) {
         updateTabContent(activeTab, e.target.value);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
         switch (e.key) {
            case "s":
               e.preventDefault();
               onMenuAction("save");
               break;
            case "w":
               e.preventDefault();
               onMenuAction("close-tab");
               break;
         }
      }

      // Handle tab key for indentation
      if (e.key === "Tab") {
         e.preventDefault();
         const textarea = e.target as HTMLTextAreaElement;
         const start = textarea.selectionStart;
         const end = textarea.selectionEnd;
         const value = textarea.value;

         if (e.shiftKey) {
            // Remove indentation
            const lineStart = value.lastIndexOf("\n", start - 1) + 1;
            if (value.substring(lineStart, lineStart + 2) === "  ") {
               const newValue =
                  value.substring(0, lineStart) +
                  value.substring(lineStart + 2);
               if (activeTab) {
                  updateTabContent(activeTab, newValue);
               }
               setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = start - 2;
               }, 0);
            }
         } else {
            // Add indentation
            const newValue =
               value.substring(0, start) + "  " + value.substring(end);
            if (activeTab) {
               updateTabContent(activeTab, newValue);
            }
            setTimeout(() => {
               textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
         }
      }
   };

   const getLanguageColor = (language: string) => {
      switch (language) {
         case "typescript":
         case "tsx":
            return "text-blue-600 dark:text-blue-400";
         case "javascript":
         case "jsx":
            return "text-yellow-600 dark:text-yellow-400";
         case "css":
         case "scss":
            return "text-pink-600 dark:text-pink-400";
         case "html":
            return "text-red-600 dark:text-red-400";
         case "json":
            return "text-orange-600 dark:text-orange-400";
         case "markdown":
            return "text-gray-600 dark:text-gray-400";
         default:
            return "text-gray-600 dark:text-gray-400";
      }
   };

   // Auto-resize textarea
   useEffect(() => {
      if (textareaRef.current) {
         textareaRef.current.style.height = "auto";
         textareaRef.current.style.height =
            textareaRef.current.scrollHeight + "px";
      }
   }, [currentTab?.content]);

   return (
      <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-[#0D1117]">
         {/* Tab Bar */}
         <div className="flex bg-gray-50 dark:bg-[#161B22] border-b border-gray-200 dark:border-[#30363D] min-h-[40px]">
            <div className="flex flex-1 overflow-x-auto">
               {tabs.map((tab) => (
                  <div
                     key={tab.id}
                     className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-[#30363D] cursor-pointer group min-w-0 ${
                        activeTab === tab.id
                           ? "bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100"
                           : "bg-gray-50 dark:bg-[#161B22] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#21262D]"
                     }`}
                     onClick={() => setActiveTab(tab.id)}
                     onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
                  >
                     <div
                        className={`w-2 h-2 rounded-full mr-2 ${getLanguageColor(
                           tab.language
                        )}`}
                     />
                     <span className="text-sm font-medium truncate max-w-32">
                        {tab.name}
                     </span>
                     {tab.unsaved && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 flex-shrink-0" />
                     )}
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           closeTab(tab.id);
                        }}
                        className="ml-2 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-[#30363D] rounded transition-opacity flex-shrink-0"
                     >
                        <X className="w-3 h-3" />
                     </button>
                  </div>
               ))}
            </div>

            <div className="flex items-center space-x-1 px-3 border-l border-gray-200 dark:border-[#30363D]">
               <button
                  onClick={() => setShowTerminal(!showTerminal)}
                  className={`p-1.5 rounded-md transition-colors ${
                     showTerminal
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#30363D]"
                  }`}
                  title="Toggle Terminal"
               >
                  <TerminalIcon className="w-4 h-4" />
               </button>

               <button
                  className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#30363D] transition-colors"
                  title="Run Code"
               >
                  <Play className="w-4 h-4" />
               </button>

               {currentTab && (
                  <button
                     onClick={() => onMenuAction("save")}
                     className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#30363D] transition-colors"
                     title="Save File"
                  >
                     <Save className="w-4 h-4" />
                  </button>
               )}
            </div>
         </div>

         {/* Editor Area */}
         <div className="flex-1 relative overflow-hidden">
            {currentTab ? (
               <div className="h-full flex">
                  {/* Line Numbers */}
                  <div className="w-12 bg-gray-50 dark:bg-[#161B22] border-r border-gray-200 dark:border-[#30363D] py-4 text-right pr-2">
                     {currentTab.content.split("\n").map((_, index) => (
                        <div
                           key={index}
                           className="text-xs text-gray-500 dark:text-gray-400 leading-6 font-mono"
                        >
                           {index + 1}
                        </div>
                     ))}
                  </div>

                  {/* Code Content */}
                  <div className="flex-1 relative">
                     <textarea
                        ref={textareaRef}
                        value={currentTab.content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full p-4 bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm leading-6 resize-none focus:outline-none"
                        style={{ minHeight: "100%" }}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                     />

                     {/* AI Suggestion Overlay */}
                     <div className="absolute top-4 right-4 z-10">
                        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm opacity-90">
                           <Sparkles className="w-4 h-4" />
                           <span>AI suggests adding error handling</span>
                           <button className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors">
                              Accept
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Welcome to DevAssist
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        Your AI-powered development environment built for
                        African developers. Open a file or create a new one to
                        get started.
                     </p>
                     <div className="flex items-center justify-center space-x-3">
                        <button
                           onClick={() => onMenuAction("new-file")}
                           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                           New File
                        </button>
                        <button
                           onClick={() => onMenuAction("upload-file")}
                           className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#21262D] rounded-md transition-colors"
                        >
                           Open File
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Context Menu */}
         {contextMenu && (
            <>
               <div
                  className="fixed inset-0 z-40"
                  onClick={() => setContextMenu(null)}
               />
               <div
                  className="fixed bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-[#30363D] rounded-md shadow-lg py-1 z-50 min-w-48"
                  style={{ left: contextMenu.x, top: contextMenu.y }}
               >
                  <button
                     onClick={() => {
                        closeTab(contextMenu.tabId);
                        setContextMenu(null);
                     }}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                  >
                     Close
                  </button>
                  <button
                     onClick={() => {
                        tabs
                           .filter((tab) => tab.id !== contextMenu.tabId)
                           .forEach((tab) => closeTab(tab.id));
                        setContextMenu(null);
                     }}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                  >
                     Close Others
                  </button>
                  <button
                     onClick={() => {
                        tabs.forEach((tab) => closeTab(tab.id));
                        setContextMenu(null);
                     }}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                  >
                     Close All
                  </button>
               </div>
            </>
         )}
      </div>
   );
};

export default CodeEditor;
