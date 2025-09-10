import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { api } from "@/lib/DevAssistAPI"; // Import your API

interface TerminalProps {
  isVisible: boolean;
  onClose: () => void;
  user: any; // Pass user data from parent
  currentDirectory?: string; // Optional current directory
}

export default function Terminal({ isVisible, onClose, user, currentDirectory = "~/project" }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<XTerminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const currentInput = useRef("");
  const isInitialized = useRef(false);

  // Get username from user data or use default
  const username = user?.username || user?.email?.split("@")[0] || "user";
  const hostname = "devassist";

  const writePrompt = () => {
    terminal.current?.write(`\x1b[36m${username}@${hostname}\x1b[0m:\x1b[34m${currentDirectory}\x1b[0m$ `);
  };

  const initializeTerminal = () => {
    if (terminalRef.current && !terminal.current) {
      // Initialize terminal with VS Code-like theme
      terminal.current = new XTerminal({
        theme: {
          background: "#162456",
          foreground: "#ffffff",
          cursor: "#ffffff",
          cursorAccent: "#ffffff",
          selection: "#264f78",
          black: "#000000",
          red: "#cd3131",
          green: "#0dbc79",
          yellow: "#e5e510",
          blue: "#2472c8",
          magenta: "#bc3fbc",
          cyan: "#11a8cd",
          white: "#ffffff",
          brightBlack: "#666666",
          brightRed: "#f14c4c",
          brightGreen: "#23d18b",
          brightYellow: "#f5f543",
          brightBlue: "#3b8eea",
          brightMagenta: "#d670d6",
          brightCyan: "#29b8db",
          brightWhite: "#ffffff",
        },
        fontSize: 14,
        fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
        cursorBlink: true,
        allowTransparency: false,
        scrollback: 1000,
      });

      fitAddon.current = new FitAddon();
      terminal.current.loadAddon(fitAddon.current);

      // Open terminal in the container
      terminal.current.open(terminalRef.current);
      fitAddon.current.fit();

      // Add welcome message and prompt
      terminal.current.write("\x1b[32mWelcome to DevAssist Terminal\x1b[0m\r\n");

      // Load command history from localStorage if available
      const savedHistory = localStorage.getItem("terminalHistory");
      if (savedHistory) {
        try {
          commandHistory.current = JSON.parse(savedHistory);
        } catch (e) {
          console.error("Failed to load terminal history:", e);
        }
      }

      writePrompt();

      // Handle terminal input
      terminal.current.onData((data) => {
        const charCode = data.charCodeAt(0);

        // Handle Enter key
        if (charCode === 13) {
          terminal.current?.write("\r\n");
          handleCommand(currentInput.current);
          if (currentInput.current.trim()) {
            commandHistory.current.push(currentInput.current);
            historyIndex.current = commandHistory.current.length;
            // Save history to localStorage
            localStorage.setItem("terminalHistory", JSON.stringify(commandHistory.current));
          }
          currentInput.current = "";
          writePrompt();
        }
        // Handle Backspace key
        else if (charCode === 127) {
          if (currentInput.current.length > 0) {
            terminal.current?.write("\b \b");
            currentInput.current = currentInput.current.slice(0, -1);
          }
        }
        // Handle Up arrow key (command history)
        else if (charCode === 27 && data.length === 3 && data.charCodeAt(1) === 91 && data.charCodeAt(2) === 65) {
          if (commandHistory.current.length > 0) {
            if (historyIndex.current > 0) {
              historyIndex.current--;
              // Clear current line
              terminal.current?.write("\x1b[2K\r");
              writePrompt();
              const previousCommand = commandHistory.current[historyIndex.current];
              terminal.current?.write(previousCommand);
              currentInput.current = previousCommand;
            }
          }
        }
        // Handle Down arrow key (command history)
        else if (charCode === 27 && data.length === 3 && data.charCodeAt(1) === 91 && data.charCodeAt(2) === 66) {
          if (historyIndex.current < commandHistory.current.length - 1) {
            historyIndex.current++;
            // Clear current line
            terminal.current?.write("\x1b[2K\r");
            writePrompt();
            const nextCommand = commandHistory.current[historyIndex.current];
            terminal.current?.write(nextCommand);
            currentInput.current = nextCommand;
          } else if (historyIndex.current === commandHistory.current.length - 1) {
            historyIndex.current++;
            // Clear current line
            terminal.current?.write("\x1b[2K\r");
            writePrompt();
            currentInput.current = "";
          }
        }
        // Handle printable characters
        else if (charCode >= 32 && charCode <= 126) {
          terminal.current?.write(data);
          currentInput.current += data;
        }
        // Handle Ctrl+C
        else if (charCode === 3) {
          terminal.current?.write("^C\r\n");
          currentInput.current = "";
          writePrompt();
        }
        // Handle Tab key (simple auto-complete)
        else if (charCode === 9) {
          const commands = ["npm", "node", "python", "git", "cd", "ls", "pwd", "echo", "clear"];
          const matching = commands.filter((cmd) => cmd.startsWith(currentInput.current));

          if (matching.length === 1) {
            const completion = matching[0].substring(currentInput.current.length);
            terminal.current?.write(completion);
            currentInput.current += completion;
          } else if (matching.length > 1) {
            terminal.current?.write("\r\n");
            matching.forEach((cmd) => terminal.current?.write(cmd + "    "));
            terminal.current?.write("\r\n");
            writePrompt();
            terminal.current?.write(currentInput.current);
          }
        }
      });

      isInitialized.current = true;

      // Focus the terminal immediately
      setTimeout(() => {
        terminal.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    initializeTerminal();

    return () => {
      if (terminal.current) {
        terminal.current.dispose();
        terminal.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      if (!terminal.current && !isInitialized.current) {
        initializeTerminal();
      }

      // Focus the terminal when it becomes visible
      const focusTimer = setTimeout(() => {
        if (terminal.current) {
          terminal.current.focus();
        }
      }, 50);

      // Fit the terminal to the container
      const fitTimer = setTimeout(() => {
        if (fitAddon.current) {
          fitAddon.current.fit();
        }
      }, 100);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(fitTimer);
      };
    }
  }, [isVisible]);

  const handleCommand = (command: string) => {
    const trimmedCmd = command.trim();

    if (trimmedCmd === "clear") {
      terminal.current?.clear();
    } else if (trimmedCmd === "help") {
      terminal.current?.write("Available commands: clear, help, npm, node, python, git, cd, ls, pwd, echo\r\n");
    } else if (trimmedCmd === "version" || trimmedCmd === "--version") {
      terminal.current?.write("DevAssist Terminal v1.0\r\n");
    } else if (trimmedCmd.startsWith("echo ")) {
      const text = trimmedCmd.substring(5);
      terminal.current?.write(`${text}\r\n`);
    } else if (trimmedCmd === "ls" || trimmedCmd === "dir") {
      terminal.current?.write("main.py\tutils.py\tsrc/\tpackage.json\tnode_modules/\r\n");
    } else if (trimmedCmd === "pwd") {
      terminal.current?.write(`${currentDirectory}\r\n`);
    } else if (trimmedCmd.startsWith("cd ")) {
      const dir = trimmedCmd.substring(3);
      terminal.current?.write(`Changed directory to ${dir}\r\n`);
    } else if (trimmedCmd.startsWith("npm ")) {
      const args = trimmedCmd.substring(4);
      if (args === "install") {
        terminal.current?.write("\x1b[32mInstalling packages...\x1b[0m\r\n");
        terminal.current?.write("added 42 packages in 2.3s\r\n");
      } else if (args === "run dev") {
        terminal.current?.write("\x1b[32mStarting development server...\x1b[0m\r\n");
        terminal.current?.write("Server running at http://localhost:3000\r\n");
      } else if (args === "start") {
        terminal.current?.write("\x1b[32mStarting application...\x1b[0m\r\n");
        terminal.current?.write("Application started successfully\r\n");
      } else {
        terminal.current?.write(`npm ${args}\r\n`);
      }
    } else if (trimmedCmd.startsWith("node ")) {
      const file = trimmedCmd.substring(5);
      if (file === "main.js") {
        terminal.current?.write("\x1b[32mHello from Node.js!\x1b[0m\r\n");
        terminal.current?.write("Server started on port 3000\r\n");
      } else {
        terminal.current?.write(`Running ${file} with Node.js\r\n`);
      }
    } else if (trimmedCmd.startsWith("python ")) {
      const file = trimmedCmd.substring(7);
      if (file === "main.py") {
        terminal.current?.write("\x1b[32mRunning Python script...\x1b[0m\r\n");
        terminal.current?.write("Fibonacci of 10 is: 55\r\n");
      } else {
        terminal.current?.write(`Running ${file} with Python\r\n`);
      }
    } else if (trimmedCmd) {
      terminal.current?.write(`\x1b[31mCommand not found: ${trimmedCmd}\x1b[0m\r\n`);
      terminal.current?.write('Type "help" for available commands\r\n');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-64 bg-blue-950 border-t border-[#3c3c3c] z-50">
      <div className="h-8 bg-green-950 text-white flex items-center px-4 text-sm justify-between border-b border-[#3c3c3c]">
        {/* <div className="text-nowrap text-[#cccccc] flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div> */}
        <span className="ml-2">Terminal</span>
        <div onClick={onClose} className="text-nowrap cursor-pointer hover:bg-[#3c3c3c] p-1 rounded" title="Close terminal">
          <X size={16} className="text-[#cccccc]" />
        </div>
      </div>
      <div
        ref={terminalRef}
        className="h-[calc(100%-32px)] w-full p-3 terminal-container"
        onClick={() => terminal.current?.focus()}
        style={{ cursor: "text" }}
      />
    </div>
  );
}
