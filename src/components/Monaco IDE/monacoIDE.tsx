import { useState, useEffect, useRef } from "react";
import AuthModal from "../dashboard/IDE/API/AuthModal";
import StatusBar from "./StatusBar";
import AIAssistant from "./AIAssistant";
import CodeEditor from "./CodeEditor";
import EditorTabs from "./EditorTabs";
import FileExplorer from "./FileExplorer";
import MenuBar from "./MenuBar";
import { api } from "@/lib/DevAssistAPI ";
import { aiService } from "@/lib/AIService ";
import Terminal from "./terminal";

export default function MonacoIDE() {
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [openFiles, setOpenFiles] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with code analysis, suggestions, and explanations. Try asking me about your code or request improvements.",
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = api.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        try {
          const userProfile = await api.getProfile();
          setUser(userProfile);
          loadWorkspace();
        } catch (error) {
          console.error("Failed to load profile:", error);
          handleLogout();
        }
      } else {
        setShowAuthModal(true);
      }
    };

    checkAuth();
  }, []);

  const loadWorkspace = () => {
    const savedWorkspace = localStorage.getItem("devassist-workspace");
    if (savedWorkspace) {
      try {
        const { files: savedFiles, folders: savedFolders, openFiles: savedOpenFiles } = JSON.parse(savedWorkspace);
        setFiles(savedFiles || []);
        setFolders(savedFolders || []);
        setOpenFiles(savedOpenFiles || []);
        if (savedOpenFiles && savedOpenFiles.length > 0) {
          setActiveFile(savedOpenFiles[0]);
        }
      } catch (e) {
        console.error("Error loading workspace:", e);
        initializeDefaultFiles();
      }
    } else {
      initializeDefaultFiles();
    }
  };

  // Save workspace to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      const workspace = { files, folders, openFiles };
      localStorage.setItem("devassist-workspace", JSON.stringify(workspace));
    }
  }, [files, folders, openFiles, isAuthenticated]);

  // Analyze code with AI when active file changes
  useEffect(() => {
    if (activeFile && activeFile.content && isAuthenticated) {
      analyzeCode();
    }
  }, [activeFile, isAuthenticated]);

  const initializeDefaultFiles = () => {
    const defaultFiles = [
      {
        id: "1",
        name: "main.py",
        content: `def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Example usage
result = fibonacci(10)
print(f"Fibonacci of 10 is: {result}")`,
        language: "python",
        path: "main.py",
      },
      {
        id: "2",
        name: "utils.py",
        content: `# Utility functions
def format_name(first, last):
    """Format a full name from first and last name"""
    return f"{first.title()} {last.title()}"

def calculate_average(numbers):
    """Calculate the average of a list of numbers"""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)`,
        language: "python",
        path: "utils.py",
      },
    ];

    const defaultFolders = [
      {
        id: "folder-1",
        name: "src",
        expanded: true,
        files: ["1", "2"],
        path: "src",
      },
    ];

    setFiles(defaultFiles);
    setFolders(defaultFolders);
    setOpenFiles([defaultFiles[0]]);
    setActiveFile(defaultFiles[0]);
  };

  // Replace all aiService calls with api.generateAIResponse()

  const analyzeCode = async () => {
    if (!activeFile || !isAuthenticated) return;

    setIsAiAnalyzing(true);
    try {
      const response = await api.generateAIResponse(
        `Analyze this code and provide suggestions:\n\n${activeFile.content}\n\nProject Context: ${getCodeContext()}`,
        "explain"
      );

      setAiSuggestions([
        {
          text: response.response || "Code analysis completed",
          severity: "info",
        },
      ]);

      if (response.response) {
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.response,
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error analyzing code:", error);
      // Handle error...
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !isAuthenticated) return;

    const newConversation = [...conversation, { role: "user", content: message }];
    setConversation(newConversation);
    setIsAiResponding(true);

    try {
      const response = await api.generateAIResponse(
        message,
        "explain",
        undefined // projectId is optional
      );

      setConversation((prev: any) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
        },
      ]);
    } catch (error) {
      // Handle error...
    } finally {
      setIsAiResponding(false);
    }
  };

  // Similarly update handleExplainCode and handleGenerateCode
  const handleExplainCode = async () => {
    if (!activeFile || !isAuthenticated) return;

    setIsAiResponding(true);
    try {
      const response = await api.generateAIResponse(`Explain this ${activeFile.language} code:\n\n${activeFile.content}`, "explain");

      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here's an explanation of the code in ${activeFile.name}:\n\n${response.response}`,
        },
      ]);
    } catch (error: any) {
      // Handle error...
    } finally {
      setIsAiResponding(false);
    }
  };

  // const handleGenerateCode = async (prompt: string) => {
  //   if (!isAuthenticated) return;

  //   setIsAiResponding(true);
  //   try {
  //     setConversation((prev) => [
  //       ...prev,
  //       {
  //         role: "user",
  //         content: `Generate code: ${prompt}`,
  //       },
  //     ]);

  //     const response = await api.generateAIResponse(prompt, "generate");

  //     setConversation((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: `Here's the code I generated based on your request:\n\n\`\`\`${"text"}\n${response.response}\n\`\`\``,
  //       },
  //     ]);
  //   } catch (error: any) {
  //     // Handle error...
  //   } finally {
  //     setIsAiResponding(false);
  //   }
  // };
  const handleGenerateCode = async (prompt: string) => {
    if (!isAuthenticated) return;

    setIsAiResponding(true);
    try {
      setConversation((prev) => [
        ...prev,
        {
          role: "user",
          content: `Generate code: ${prompt}`,
        },
      ]);

      const response = await api.generateAIResponse(prompt, "generate");
      const generatedCode = response.response || "";

      if (generatedCode) {
        // Offer different options to the user
        const userChoice = window.confirm("Generated code ready! Click OK to replace current content, or Cancel to view it first.");

        if (userChoice) {
          // Replace content
          replaceFileContent(generatedCode);
          setConversation((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `I've replaced the file content with the generated code.`,
            },
          ]);
        } else {
          // Show code without replacing
          setConversation((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Here's the code I generated. Use the "Replace All" button if you want to use it:\n\n\`\`\`\n${generatedCode}\n\`\`\``,
            },
          ]);

          // Add to suggestions for later use
          setAiSuggestions([
            {
              text: "Generated code available",
              replacement: generatedCode,
              severity: "info",
            },
          ]);
        }
      }
    } catch (error: any) {
      // Error handling...
    } finally {
      setIsAiResponding(false);
    }
  };

  // Add this function to your MonacoIDE component
  const replaceFileContent = (content: string) => {
    if (activeFile && editorRef.current) {
      // Update the file content in state
      updateFile(activeFile.id, content);

      // If you want to programmatically set the editor content
      const editor = editorRef.current;
      if (editor && typeof editor.setValue === "function") {
        editor.setValue(content);
      }
    }
  };

  const getCodeContext = () => {
    // Create a context string with information about all files
    let context = "Project files:\n";

    files.forEach((file: any) => {
      context += `File: ${file.name}\n`;
      if (file.name === activeFile.name) {
        context += "--- CURRENTLY OPENED FILE ---\n";
      }
      context += `${file.content.substring(0, 200)}...\n\n`;
    });

    return context;
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const updateFile = (id: string, content: string) => {
    setFiles((prev: any) => prev.map((f: any) => (f.id === id ? { ...f, content } : f)));
  };

  const addFile = (name: string, folderId: string = "") => {
    if (!files.find((f: any) => f.name === name)) {
      const newFile = {
        id: Date.now().toString(),
        name,
        content: getDefaultContentForFileType(name),
        language: name.endsWith(".py")
          ? "python"
          : name.endsWith(".js")
          ? "javascript"
          : name.endsWith(".html")
          ? "html"
          : name.endsWith(".css")
          ? "css"
          : name.endsWith(".md")
          ? "markdown"
          : "plaintext",
        path: folderId ? `${folderId}/${name}` : name,
      };

      setFiles((prev: any) => [...prev, newFile]);
      openFile(newFile);

      if (folderId) {
        setFolders((prev: any) => prev.map((f: any) => (f.id === folderId ? { ...f, files: [...f.files, newFile.id] } : f)));
      }
    }
  };

  const getDefaultContentForFileType = (filename: string) => {
    if (filename.endsWith(".html")) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

</body>
</html>`;
    } else if (filename.endsWith(".css")) {
      return `body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}`;
    } else if (filename.endsWith(".js")) {
      return `// JavaScript file
console.log('Hello World');`;
    } else if (filename.endsWith(".py")) {
      return `# Python file
print("Hello World")`;
    }
    return "";
  };

  const addFolder = (name: string) => {
    if (!folders.find((f: any) => f.name === name)) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name,
        expanded: false,
        files: [],
        path: name,
      };
      setFolders((prev: any) => [...prev, newFolder]);
    }
  };

  const deleteFile = (fileId: string) => {
    setOpenFiles((prev: any) => prev.filter((f: any) => f.id !== fileId));
    setFolders((prev: any) =>
      prev.map((folder: any) => ({
        ...folder,
        files: folder.files.filter((id: string) => id !== fileId),
      }))
    );
    setFiles((prev: any) => prev.filter((f: any) => f.id !== fileId));

    if (activeFile && activeFile.id === fileId) {
      setActiveFile(openFiles.length > 1 ? openFiles.find((f: any) => f.id !== fileId) || openFiles[0] : null);
    }
  };

  const deleteFolder = (folderId: string) => {
    const folder = folders.find((f: any) => f.id === folderId);

    if (folder && folder.files.length > 0) {
      folder.files.forEach((fileId: string) => {
        deleteFile(fileId);
      });
    }

    setFolders((prev: any) => prev.filter((f: any) => f.id !== folderId));
  };

  const toggleFolder = (folderId: string) => {
    setFolders((prev: any) => prev.map((f: any) => (f.id === folderId ? { ...f, expanded: !f.expanded } : f)));
  };

  const openFile = (file: any) => {
    if (!openFiles.find((f: any) => f.id === file.id)) {
      setOpenFiles((prev: any) => [...prev, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter((f: any) => f.id !== fileId);
    setOpenFiles(newOpenFiles);

    if (activeFile && activeFile.id === fileId) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const applySuggestion = (suggestion: any) => {
    if (activeFile && editorRef.current) {
      const currentContent = activeFile.content;
      const newContent = currentContent + "\n\n" + suggestion.replacement;
      updateFile(activeFile.id, newContent);

      // Add to conversation
      setConversation((prev: any) => [
        ...prev,
        {
          role: "assistant",
          content: `I've applied the suggestion: ${suggestion.text}`,
        },
      ]);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    loadWorkspace();
  };

  const handleLogout = () => {
    api.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setFiles([]);
    setFolders([]);
    setOpenFiles([]);
    setActiveFile(null);
    setConversation([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. I can help you with code analysis, suggestions, and explanations. Try asking me about your code or request improvements.",
      },
    ]);
  };

  // File menu actions
  const newFile = () => {
    const fileName = prompt("Enter file name (include extension):");
    if (fileName) {
      addFile(fileName);
    }
  };

  const newFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      addFolder(folderName);
    }
  };

  const saveFile = () => {
    if (activeFile) {
      alert(`Saved ${activeFile.name}`);
      const blob = new Blob([activeFile.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = activeFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const saveAllFiles = () => {
    openFiles.forEach((file: any) => {
      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    alert(`Saved ${openFiles.length} files`);
  };

  const openFileFromDisk = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".py,.js,.html,.css,.md,.txt";

    input.onchange = (e: any) => {
      const fileList = e.target.files;
      if (fileList.length > 0) {
        Array.from(fileList).forEach((file: any) => {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const content = event.target.result;
            const newFile = {
              id: Date.now().toString(),
              name: file.name,
              content,
              language: file.name.endsWith(".py")
                ? "python"
                : file.name.endsWith(".js")
                ? "javascript"
                : file.name.endsWith(".html")
                ? "html"
                : file.name.endsWith(".css")
                ? "css"
                : file.name.endsWith(".md")
                ? "markdown"
                : "plaintext",
              path: file.name,
            };

            setFiles((prev: any) => [...prev, newFile]);
            openFile(newFile);
          };
          reader.readAsText(file);
        });
      }
    };

    input.click();
  };

  const openFolderFromDisk = () => {
    alert("Folder opening functionality is limited in browser environments. In a desktop app, this would open a folder dialog.");
  };

  return (
    <div className="flex flex-col h-screen">
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}

      <MenuBar
        isAuthenticated={isAuthenticated}
        user={user}
        onNewFile={newFile}
        onNewFolder={newFolder}
        onOpenFile={openFileFromDisk}
        onOpenFolder={openFolderFromDisk}
        onSaveFile={saveFile}
        onSaveAllFiles={saveAllFiles}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          files={files}
          folders={folders}
          activeFile={activeFile}
          onFileClick={openFile}
          onAddFile={addFile}
          onAddFolder={addFolder}
          onDeleteFile={deleteFile}
          onDeleteFolder={deleteFolder}
          onToggleFolder={toggleFolder}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col border-r border-white relative">
          <EditorTabs openFiles={openFiles} activeFile={activeFile} onFileClick={openFile} onCloseFile={closeFile} />

          <CodeEditor activeFile={activeFile} onContentChange={updateFile} onEditorMount={handleEditorDidMount} />

          <div className="w-full absolute bottom-0 right-0 left-0 z-[9999]">
            <Terminal isVisible={isTerminalVisible} onClose={() => setIsTerminalVisible(false)} user={user} currentDirectory="~/project" />
          </div>
        </div>

        <AIAssistant
          isAuthenticated={isAuthenticated}
          isAiAnalyzing={isAiAnalyzing}
          aiSuggestions={aiSuggestions}
          conversation={conversation}
          isAiResponding={isAiResponding}
          activeFile={activeFile}
          onSendMessage={handleSendMessage}
          onApplySuggestion={applySuggestion}
          onExplainCode={handleExplainCode}
          onGenerateCode={handleGenerateCode}
          onReplaceContent={replaceFileContent}
        />
      </div>

      <StatusBar
        activeFile={activeFile}
        isAuthenticated={isAuthenticated}
        isTerminalVisible={isTerminalVisible}
        onToggleTerminal={() => setIsTerminalVisible(!isTerminalVisible)}
      />
    </div>
  );
}
