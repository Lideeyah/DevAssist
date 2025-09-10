import { useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { File } from "lucide-react";
import Terminal from "./terminal";

interface CodeEditorProps {
  activeFile: any;
  onContentChange: (id: string, content: string) => void;
  onEditorMount: (editor: any, monaco: any) => void;
}

export default function CodeEditor({ activeFile, isTerminalVisible, onContentChange, onEditorMount }: CodeEditorProps) {
  const editorRef = useRef(null);

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <File size={48} className="mx-auto mb-4 opacity-50" />
          <p>No file open</p>
          <p className="text-sm mt-2">Open a file from the explorer or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MonacoEditor
        key={activeFile.id}
        height="100%"
        language={activeFile.language}
        theme="hc-black"
        value={activeFile.content}
        onChange={(val) => onContentChange(activeFile.id, val || "")}
        onMount={onEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
      <Terminal isVisible={isTerminalVisible} />
    </>
  );
}
