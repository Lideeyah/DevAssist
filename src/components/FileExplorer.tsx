import React, { useState } from "react";
import {
   FolderOpen,
   Folder,
   File,
   ChevronRight,
   ChevronDown,
   Plus,
   Upload,
   FileText,
   Image,
   Code,
   Database,
   Settings,
} from "lucide-react";
import { FileItem } from "../App";

interface FileExplorerProps {
   files: FileItem[];
   setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
   openFile: (file: FileItem) => void;
   onMenuAction: (action: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
   files,
   setFiles,
   openFile,
   onMenuAction,
}) => {
   const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      file?: FileItem;
   } | null>(null);

   const getFileIcon = (fileName: string, isFolder: boolean) => {
      if (isFolder) return Folder;

      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
         case "js":
         case "jsx":
         case "ts":
         case "tsx":
         case "vue":
         case "svelte":
            return Code;
         case "json":
         case "xml":
         case "yaml":
         case "yml":
            return Database;
         case "png":
         case "jpg":
         case "jpeg":
         case "gif":
         case "svg":
         case "webp":
            return Image;
         case "md":
         case "txt":
         case "rtf":
            return FileText;
         case "config":
         case "env":
         case "gitignore":
            return Settings;
         default:
            return File;
      }
   };

   const getFileColor = (fileName: string, isFolder: boolean) => {
      if (isFolder) return "text-blue-500 dark:text-blue-400";

      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
         case "js":
         case "jsx":
            return "text-yellow-500 dark:text-yellow-400";
         case "ts":
         case "tsx":
            return "text-blue-600 dark:text-blue-400";
         case "vue":
            return "text-green-500 dark:text-green-400";
         case "json":
            return "text-orange-500 dark:text-orange-400";
         case "md":
            return "text-gray-600 dark:text-gray-400";
         case "css":
         case "scss":
         case "sass":
            return "text-pink-500 dark:text-pink-400";
         case "html":
            return "text-red-500 dark:text-red-400";
         default:
            return "text-gray-500 dark:text-gray-400";
      }
   };

   const toggleFolder = (fileId: string) => {
      const updateFiles = (items: FileItem[]): FileItem[] => {
         return items.map((item) => {
            if (item.id === fileId && item.type === "folder") {
               return { ...item, isOpen: !item.isOpen };
            }
            if (item.children) {
               return { ...item, children: updateFiles(item.children) };
            }
            return item;
         });
      };
      setFiles(updateFiles);
   };

   const handleContextMenu = (e: React.MouseEvent, file?: FileItem) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, file });
   };

   const handleContextMenuAction = (action: string) => {
      if (action === "new-file" || action === "new-folder") {
         onMenuAction(action);
      }
      setContextMenu(null);
   };

   const renderFileTree = (items: FileItem[], depth = 0) => {
      return items.map((item) => {
         const Icon = getFileIcon(item.name, item.type === "folder");
         const iconColor = getFileColor(item.name, item.type === "folder");

         return (
            <div key={item.id}>
               <div
                  className={`flex items-center space-x-1 py-1 px-2 hover:bg-gray-100 dark:hover:bg-[#262C36] cursor-pointer rounded text-sm group`}
                  style={{ paddingLeft: `${8 + depth * 16}px` }}
                  onClick={() =>
                     item.type === "folder"
                        ? toggleFolder(item.id)
                        : openFile(item)
                  }
                  onContextMenu={(e) => handleContextMenu(e, item)}
               >
                  {item.type === "folder" && (
                     <div className="w-4 h-4 flex items-center justify-center">
                        {item.isOpen ? (
                           <ChevronDown className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        ) : (
                           <ChevronRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        )}
                     </div>
                  )}
                  {item.type === "file" && <div className="w-4" />}
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                  <span className="text-gray-800 dark:text-gray-200 truncate flex-1">
                     {item.name}
                  </span>
                  {item.unsaved && (
                     <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  )}
               </div>

               {item.type === "folder" && item.isOpen && item.children && (
                  <div>{renderFileTree(item.children, depth + 1)}</div>
               )}
            </div>
         );
      });
   };

   return (
      <div className="h-full flex flex-col">
         <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-[#30363D]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
               Explorer
            </h3>
            <div className="flex items-center space-x-1">
               <button
                  onClick={() => onMenuAction("new-file")}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#262C36] transition-colors"
                  title="New File"
               >
                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
               <button
                  onClick={() => onMenuAction("new-folder")}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#262C36] transition-colors"
                  title="New Folder"
               >
                  <FolderOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
               <button
                  onClick={() => onMenuAction("upload-file")}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#262C36] transition-colors"
                  title="Upload Files"
               >
                  <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
            </div>
         </div>

         <div
            className="flex-1 overflow-y-auto p-2"
            onContextMenu={(e) => handleContextMenu(e)}
         >
            {files.length === 0 ? (
               <div className="text-center py-8">
                  <Folder className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                     No files in workspace
                  </p>
                  <div className="space-y-2">
                     <button
                        onClick={() => onMenuAction("upload-file")}
                        className="block w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                     >
                        Open File
                     </button>
                     <button
                        onClick={() => onMenuAction("upload-folder")}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded-md transition-colors"
                     >
                        Open Folder
                     </button>
                  </div>
               </div>
            ) : (
               <div className="space-y-1">{renderFileTree(files)}</div>
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
                     onClick={() => handleContextMenuAction("new-file")}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                  >
                     New File
                  </button>
                  <button
                     onClick={() => handleContextMenuAction("new-folder")}
                     className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                  >
                     New Folder
                  </button>
                  {contextMenu.file && (
                     <>
                        <div className="border-t border-gray-200 dark:border-[#30363D] my-1" />
                        <button
                           onClick={() => setContextMenu(null)}
                           className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                        >
                           Rename
                        </button>
                        <button
                           onClick={() => setContextMenu(null)}
                           className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#262C36]"
                        >
                           Delete
                        </button>
                     </>
                  )}
               </div>
            </>
         )}
      </div>
   );
};

export default FileExplorer;
