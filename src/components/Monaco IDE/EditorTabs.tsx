import { File, X } from "lucide-react";

interface EditorTabsProps {
  openFiles: any[];
  activeFile: any;
  onFileClick: (file: any) => void;
  onCloseFile: (fileId: string, e: React.MouseEvent) => void;
}

export default function EditorTabs({ openFiles, activeFile, onFileClick, onCloseFile }: EditorTabsProps) {
  if (openFiles.length === 0) return null;

  return (
    <div className="flex bg-background border-b border-white overflow-x-auto">
      {openFiles.map((file: any) => (
        <div
          key={file.id}
          className={`flex items-center px-3 py-1 border-r border-white cursor-pointer group ${
            activeFile && activeFile.id === file.id ? "bg-secondary" : "bg-gray-800 hover:bg-gray-750"
          }`}
          onClick={() => onFileClick(file)}
        >
          <File size={12} className="mr-2" />
          <span className="text-sm whitespace-nowrap">{file.name}</span>
          <X size={12} className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded" onClick={(e) => onCloseFile(file.id, e)} />
        </div>
      ))}
    </div>
  );
}
