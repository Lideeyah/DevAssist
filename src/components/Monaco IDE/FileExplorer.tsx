import { useState } from "react";
import { File, Folder, FilePlus, FolderPlus, Trash2 } from "lucide-react";

interface FileExplorerProps {
  files: any[];
  folders: any[];
  activeFile: any;
  onFileClick: (file: any) => void;
  onAddFile: (name: string, folderId?: string) => void;
  onAddFolder: (name: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onToggleFolder: (folderId: string) => void;
}

export default function FileExplorer({
  files,
  folders,
  activeFile,
  onFileClick,
  onAddFile,
  onAddFolder,
  onDeleteFile,
  onDeleteFolder,
  onToggleFolder,
}: FileExplorerProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const newFile = () => {
    const fileName = prompt("Enter file name (include extension):");
    if (fileName) {
      onAddFile(fileName);
    }
  };

  const newFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      onAddFolder(folderName);
    }
  };

  return (
    <div className="w-48 bg-gray-850 border-r border-white text-sm">
      <div className="border-b p-2 border-white flex items-center justify-between">
        <h3 className="text-sm font-semibold">EXPLORER</h3>
        <div className="flex gap-2">
          <FilePlus size={14} className="cursor-pointer hover:text-chart-2" onClick={newFile} />
          <FolderPlus size={14} className="cursor-pointer hover:text-chart-2" onClick={newFolder} />
        </div>
      </div>

      <div className="pl-1">
        {/* Folders */}
        {folders.map((folder: any) => (
          <div key={folder.id}>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-700 p-1 flex-1" onClick={() => onToggleFolder(folder.id)}>
                <Folder size={14} className={folder.expanded ? "text-chart-2" : ""} />
                <span className="text-sm">{folder.name}</span>
              </div>

              <Trash2
                size={12}
                className="cursor-pointer text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  if (window.confirm(`Delete folder "${folder.name}" and all its contents?`)) {
                    onDeleteFolder(folder.id);
                  }
                }}
              />
            </div>

            {folder.expanded && (
              <div className="ml-4 mt-1">
                {folder.files.map((fileId: string) => {
                  const file = files.find((f: any) => f.id === fileId);
                  return file ? (
                    <div key={file.id} className="flex items-center justify-between group">
                      <div
                        className={`px-2 py-1 flex items-center gap-2 rounded-l-sm border-chart-2 cursor-pointer flex-1 ${
                          activeFile && activeFile.id === file.id ? "bg-secondary border-l-2 text-chart-2" : "hover:bg-gray-700"
                        }`}
                        onClick={() => onFileClick(file)}
                      >
                        <File size={12} />
                        <span className="text-xs">{file.name}</span>
                      </div>
                      <Trash2
                        size={12}
                        className="cursor-pointer text-gray-500 hover:text-red-400 mx-1 opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          if (window.confirm(`Delete file "${file.name}"?`)) {
                            onDeleteFile(file.id);
                          }
                        }}
                      />
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}

        {/* Root level files (not in any folder) */}
        {files
          .filter((file: any) => !folders.some((folder: any) => folder.files.includes(file.id)))
          .map((file: any) => (
            <div key={file.id} className="flex items-center justify-between group ml-3">
              <div
                className={`px-2 py-1 flex items-center gap-2 rounded-l-sm border-chart-2 cursor-pointer flex-1 ${
                  activeFile && activeFile.id === file.id ? "bg-secondary border-l-2 text-chart-2" : "hover:bg-gray-700"
                }`}
                onClick={() => onFileClick(file)}
              >
                <File size={12} />
                <span className="text-xs">{file.name}</span>
              </div>
              <Trash2
                size={12}
                className="cursor-pointer text-gray-500 hover:text-red-400 mx-1 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  if (window.confirm(`Delete file "${file.name}"?`)) {
                    onDeleteFile(file.id);
                  }
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
