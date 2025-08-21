import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Minimize2, Square, X, Copy } from "lucide-react";

const Terminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "🌍 DevAssist Terminal - Built for African Developers",
    "$ npm run dev",
    "> devassist@1.0.0 dev",
    "> vite",
    "",
    "  VITE v5.0.0  ready in 1.2s",
    "  ➜  Local:   http://localhost:5173/",
    "  ➜  Network: http://192.168.1.100:5173/",
    "  ➜  AI Assistant: Ready to help 🚀",
    "",
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const newHistory = [...history, `$ ${trimmedCmd}`];
    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    switch (trimmedCmd.toLowerCase()) {
      case "clear":
        setHistory(["🌍 DevAssist Terminal - Built for African Developers"]);
        break;
      case "help":
        newHistory.push(
          "Available commands:",
          "  help         - Show this help message",
          "  clear        - Clear terminal",
          "  ls           - List files and directories",
          "  pwd          - Show current directory",
          "  npm run dev  - Start development server",
          "  npm install  - Install dependencies",
          "  git status   - Show git status",
          "  ai help      - AI development assistance",
          "  deploy       - Deploy to production",
          "  whoami       - Show current user",
          ""
        );
        setHistory(newHistory);
        break;
      case "ls":
        newHistory.push("src/", "public/", "node_modules/", "package.json", "README.md", "tsconfig.json", "vite.config.ts", "");
        setHistory(newHistory);
        break;
      case "pwd":
        newHistory.push("/home/project", "");
        setHistory(newHistory);
        break;
      case "whoami":
        newHistory.push("african-developer", "");
        setHistory(newHistory);
        break;
      case "git status":
        newHistory.push(
          "On branch main",
          "Your branch is up to date with 'origin/main'.",
          "",
          "Changes not staged for commit:",
          '  (use "git add <file>..." to update what will be committed)',
          '  (use "git checkout -- <file>..." to discard changes in working directory)',
          "",
          "        modified:   src/App.tsx",
          "        modified:   src/components/CodeEditor.tsx",
          "",
          'no changes added to commit (use "git add" to stage changes)',
          ""
        );
        setHistory(newHistory);
        break;
      case "npm install":
        newHistory.push(
          "Installing dependencies...",
          "✓ react@18.2.0",
          "✓ typescript@5.0.0",
          "✓ vite@5.0.0",
          "✓ tailwindcss@3.4.0",
          "",
          "Dependencies installed successfully!",
          ""
        );
        setHistory(newHistory);
        break;
      case "ai help":
        newHistory.push(
          "🤖 DevAssist AI Terminal Helper",
          "  Your AI coding companion is ready!",
          '  • Type "ai debug" for debugging help',
          '  • Type "ai optimize" for performance tips',
          '  • Type "ai test" for testing suggestions',
          '  • Type "ai deploy africa" for Africa-specific deployment',
          '  • Type "ai review" for code review assistance',
          ""
        );
        setHistory(newHistory);
        break;
      case "ai debug":
        newHistory.push(
          "🔍 AI Debug Assistant activated",
          "  Analyzing your code for potential issues...",
          "  ✓ No syntax errors found",
          "  ⚠ Consider adding error boundaries in React components",
          "  ⚠ Some async operations lack proper error handling",
          "  💡 Tip: Use try-catch blocks for better error management",
          ""
        );
        setHistory(newHistory);
        break;
      case "deploy":
        newHistory.push(
          "🚀 Deploying to production...",
          "  Building optimized bundle",
          "  Configuring for African CDN network",
          "  Setting up Paystack/Flutterwave payments",
          "  Optimizing for mobile connections",
          "  Deployed successfully!",
          "🌍 Your app is live across Africa!",
          "📱 Mobile-optimized for better accessibility",
          ""
        );
        setHistory(newHistory);
        break;
      default:
        if (trimmedCmd.startsWith("npm ")) {
          newHistory.push(
            `Running: ${trimmedCmd}`,
            "⚡ DevAssist optimized for African developers",
            "📱 Mobile-first approach enabled",
            "🌍 CDN configured for African regions",
            "Command completed successfully!",
            ""
          );
        } else {
          newHistory.push(`command not found: ${trimmedCmd}`, 'Type "help" for available commands', "");
        }
        setHistory(newHistory);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(history.join("\n"));
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm text-gray-300">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={copyToClipboard} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200" title="Copy output">
            <Copy className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <Minimize2 className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <Square className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600" onClick={() => inputRef.current?.focus()}>
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
            {line}
          </div>
        ))}

        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
