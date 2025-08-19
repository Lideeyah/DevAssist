import { useState } from "react";
import SplitPane from "react-split-pane";
import { Editor } from "@monaco-editor/react";

export default function EditorIDE() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput(`<h1 class="text-xl text-green-400">Hello from Preview 🚀</h1>`);
  };

  return (
    <div className="w-full max-w-2xl rounded-sm border overflow-hidden h-[calc(100vh-198px)] pb-4">
      <SplitPane split="vertical" minSize={200} maxSize={-200} defaultSize="30%" className="!overflow-vidible rounded-sm pb-10 w-full max-w-5xl mx-6">
        {/* Left - Monaco Editor */}
        <div className="flex flex-col rounded-l-sm  h-full bg-black text-white w-full">
          <div className="p-2 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-sm font-bold">DevAssist</h1>
            <button onClick={handleRun} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs">
              Run
            </button>
          </div>
          <Editor
            height="100%"
            width="100%"
            className="rounded-l-sm"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={input}
            onChange={(val) => setInput(val || "")}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Right - Preview */}
        <div className="h-full bg-gray-900 overflow-auto p-4 w-full rounded-r-sm">
          {output ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-4" dangerouslySetInnerHTML={{ __html: output }} />
          ) : (
            <p className="text-gray-500">Write a request and click Run...</p>
          )}
        </div>
      </SplitPane>
    </div>
  );
}
