import { useState, useEffect } from "react";
import { FileText, Code, Monitor, FileCode } from "lucide-react";

interface File {
  filename: string;
  content: string;
  mimeType: string;
}

interface CodeEditorProps {
  files: File[];
  currentFile: string;
  onFileSelect: (filename: string) => void;
  onFileUpdate: (filename: string, content: string) => void;
}

export default function editCode({ files, currentFile, onFileSelect, onFileUpdate }: CodeEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const currentFileData = files.find((f) => f.filename === currentFile);
    setContent(currentFileData?.content || "");
  }, [currentFile, files]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (currentFile) {
      onFileUpdate(currentFile, newContent);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop();
    switch (extension) {
      case "html":
        return <FileCode size={14} className="text-orange-400" />;
      case "css":
        return <Code size={14} className="text-blue-400" />;
      case "js":
        return <Code size={14} className="text-yellow-400" />;
      case "json":
        return <FileText size={14} className="text-green-400" />;
      default:
        return <FileText size={14} className="text-neutral-400" />;
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900 text-neutral-500">
        <div className="text-center">
          <Monitor size={48} className="mx-auto mb-4 opacity-50" />
          <p>No files available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-neutral-900">
      {/* File sidebar */}
      <div className="w-64 bg-neutral-800 border-r border-neutral-700 p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
          <Monitor size={16} />
          Project Files
        </h3>
        <div className="space-y-1">
          {files.map((file) => (
            <button
              key={file.filename}
              onClick={() => onFileSelect(file.filename)}
              className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 transition-colors ${
                currentFile === file.filename ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {getFileIcon(file.filename)}
              <span className="truncate">{file.filename}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 flex flex-col">
        {currentFile ? (
          <>
            <div className="bg-neutral-800 px-4 py-2 border-b border-neutral-700 flex items-center justify-between">
              <span className="text-sm text-neutral-300 font-mono">{currentFile}</span>
              <div className="text-xs text-neutral-500">{files.find((f) => f.filename === currentFile)?.mimeType}</div>
            </div>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 bg-neutral-900 text-white font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
              placeholder="Start coding..."
              spellCheck="false"
              style={{ tabSize: 2 }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500">Select a file to edit</div>
        )}
      </div>
    </div>
  );
}
