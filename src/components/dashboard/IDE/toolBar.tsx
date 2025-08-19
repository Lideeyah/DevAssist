import { FiPlus, FiFolderPlus, FiSun, FiMoon, FiSave } from "react-icons/fi";

interface ToolbarProps {
  theme: "light" | "vs-dark";
  setTheme: (theme: "light" | "vs-dark") => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

export default function Toolbar({ theme, setTheme, onCreateFile, onCreateFolder }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-700 rounded" onClick={() => setTheme(theme === "light" ? "vs-dark" : "light")} title="Toggle theme">
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
        <button className="p-2 hover:bg-gray-700 rounded" onClick={onCreateFile} title="New File">
          <FiPlus />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded" onClick={onCreateFolder} title="New Folder">
          <FiFolderPlus />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded" title="Save">
          <FiSave />
        </button>
      </div>
      <div className="text-sm text-gray-400">Monaco Editor IDE</div>
    </div>
  );
}
