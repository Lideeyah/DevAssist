interface StatusBarProps {
  activeFile: any;
  isAuthenticated: boolean;
  isTerminalVisible: boolean;
  onToggleTerminal: () => void;
}

export default function StatusBar({ activeFile, isAuthenticated, isTerminalVisible, onToggleTerminal }: StatusBarProps) {
  return (
    <div className="h-6 flex bg-chart-2 items-center px-4 text-xs justify-between border-t border-secondary">
      <div className="text-nowrap">{activeFile ? `${activeFile.language.toUpperCase()} | UTF-8` : "No file selected"}</div>
      <div className="flex items-center gap-4">
        <div className="text-nowrap flex items-center gap-1 cursor-pointer hover:text-chart-1" onClick={onToggleTerminal}>
          <div className={`w-2 h-2 rounded-full ${isTerminalVisible ? "bg-chart-1" : "bg-gray-500"}`}></div>
          <span>Terminal</span>
        </div>
        <div className="text-nowrap flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
          <span>{isAuthenticated ? "AI Active" : "Not Authenticated"}</span>
        </div>
      </div>
    </div>
  );
}
