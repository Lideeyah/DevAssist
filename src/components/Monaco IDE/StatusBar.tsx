interface StatusBarProps {
  activeFile: any;
  isAuthenticated: boolean;
}

export default function StatusBar({ activeFile, isAuthenticated }: StatusBarProps) {
  return (
    <div className="h-6 flex bg-gray-800 items-center px-4 text-xs justify-between border-t border-gray-700">
      <div className="text-nowrap">{activeFile ? `${activeFile.language.toUpperCase()} | UTF-8` : "No file selected"}</div>
      <div className="text-nowrap flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>{isAuthenticated ? "AI Active" : "Not Authenticated"}</span>
      </div>
    </div>
  );
}
