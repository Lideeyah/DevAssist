import { useState } from "react";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileItem[];
}

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "src",
      type: "folder",
      children: [
        {
          id: "2",
          name: "components",
          type: "folder",
          children: [
            {
              id: "3",
              name: "App.tsx",
              type: "file",
              content:
                'import React from "react";\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default App;',
            },
            { id: "4", name: "index.css", type: "file", content: "body {\n  margin: 0;\n  font-family: sans-serif;\n}" },
          ],
        },
        {
          id: "5",
          name: "index.html",
          type: "file",
          content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>',
        },
      ],
    },
  ]);

  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["1", "2"]);

  const createFile = (parentId: string, name: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: "file",
      content: "",
    };

    const updateFiles = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newFile],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateFiles(item.children),
          };
        }
        return item;
      });
    };

    setFiles(updateFiles(files));
    setActiveFile(newFile);
  };

  const createFolder = (parentId: string, name: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name,
      type: "folder",
      children: [],
    };

    const updateFiles = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newFolder],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateFiles(item.children),
          };
        }
        return item;
      });
    };

    setFiles(updateFiles(files));
    setExpandedFolders([...expandedFolders, newFolder.id]);
  };

  const updateFileContent = (fileId: string, content: string) => {
    const updateFiles = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === fileId && item.type === "file") {
          return { ...item, content };
        }
        if (item.children) {
          return {
            ...item,
            children: updateFiles(item.children),
          };
        }
        return item;
      });
    };

    setFiles(updateFiles(files));
    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, content });
    }
  };

  const toggleFolder = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter((id) => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  return {
    files,
    activeFile,
    setActiveFile,
    createFile,
    createFolder,
    updateFileContent,
    expandedFolders,
    toggleFolder,
  };
}
