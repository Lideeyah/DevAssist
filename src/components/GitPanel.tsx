import React, { useState } from "react";
import {
   GitBranch,
   GitCommit,
   Plus,
   Minus,
   FileText,
   RefreshCw,
} from "lucide-react";

const GitPanel: React.FC = () => {
   const [changes] = useState([
      { file: "src/App.tsx", status: "modified", additions: 12, deletions: 3 },
      {
         file: "src/components/Header.tsx",
         status: "modified",
         additions: 5,
         deletions: 1,
      },
      {
         file: "src/utils/helpers.ts",
         status: "added",
         additions: 25,
         deletions: 0,
      },
      { file: "README.md", status: "deleted", additions: 0, deletions: 15 },
   ]);

   const [commitMessage, setCommitMessage] = useState("");
   const [currentBranch] = useState("main");

   const getStatusColor = (status: string) => {
      switch (status) {
         case "modified":
            return "text-orange-500 dark:text-orange-400";
         case "added":
            return "text-green-500 dark:text-green-400";
         case "deleted":
            return "text-red-500 dark:text-red-400";
         default:
            return "text-gray-500 dark:text-gray-400";
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "modified":
            return "M";
         case "added":
            return "A";
         case "deleted":
            return "D";
         default:
            return "?";
      }
   };

   return (
      <div className="h-full flex flex-col">
         <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
            <div className="flex items-center justify-between mb-3">
               <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                  Source Control
               </h3>
               <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#262C36] transition-colors">
                  <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
               <GitBranch className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {currentBranch}
               </span>
               <span className="text-gray-500 dark:text-gray-400">•</span>
               <span className="text-gray-600 dark:text-gray-400">
                  {changes.length} changes
               </span>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {/* Commit Section */}
            <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
               <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Commit message"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
               />
               <div className="flex items-center space-x-2 mt-2">
                  <button
                     disabled={!commitMessage.trim()}
                     className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
                  >
                     Commit
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-[#30363D] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] text-sm rounded-md transition-colors">
                     Commit & Push
                  </button>
               </div>
            </div>

            {/* Changes Section */}
            <div className="p-3">
               <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Changes ({changes.length})
               </h4>

               <div className="space-y-1">
                  {changes.map((change, index) => (
                     <div
                        key={index}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded cursor-pointer group"
                     >
                        <div
                           className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${getStatusColor(
                              change.status
                           )}`}
                        >
                           {getStatusIcon(change.status)}
                        </div>
                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">
                           {change.file}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                           {change.additions > 0 && (
                              <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                 <Plus className="w-3 h-3" />
                                 <span>{change.additions}</span>
                              </span>
                           )}
                           {change.deletions > 0 && (
                              <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                 <Minus className="w-3 h-3" />
                                 <span>{change.deletions}</span>
                              </span>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Recent Commits */}
            <div className="p-3 border-t border-gray-200 dark:border-[#30363D]">
               <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Recent Commits
               </h4>

               <div className="space-y-2">
                  {[
                     {
                        hash: "a1b2c3d",
                        message: "Add new AI assistant features",
                        author: "You",
                        time: "2 hours ago",
                     },
                     {
                        hash: "e4f5g6h",
                        message: "Fix responsive design issues",
                        author: "You",
                        time: "1 day ago",
                     },
                     {
                        hash: "i7j8k9l",
                        message: "Update dependencies",
                        author: "You",
                        time: "3 days ago",
                     },
                  ].map((commit, index) => (
                     <div
                        key={index}
                        className="flex items-start space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded cursor-pointer"
                     >
                        <GitCommit className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                              {commit.message}
                           </p>
                           <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-mono">{commit.hash}</span>
                              <span>•</span>
                              <span>{commit.author}</span>
                              <span>•</span>
                              <span>{commit.time}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default GitPanel;
