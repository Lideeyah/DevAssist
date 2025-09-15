import { useState, useEffect } from "react";

interface LivePreviewProps {
  files: Array<{
    filename: string;
    content: string;
  }>;
  mainFile: string;
  deviceSize: "desktop" | "laptop" | "phone";
}

export default function LivePreview({ files, mainFile, deviceSize }: LivePreviewProps) {
  const [iframeContent, setIframeContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const generatePreview = () => {
      try {
        const htmlFile = files.find((f) => f.filename === mainFile || f.filename.endsWith(".html"));
        const cssFiles = files.filter((f) => f.filename.endsWith(".css"));
        const jsFiles = files.filter((f) => f.filename.endsWith(".js"));

        if (!htmlFile) {
          setError("No HTML file found for preview");
          return "";
        }

        let htmlContent = htmlFile.content;

        // Inject CSS styles
        if (cssFiles.length > 0) {
          const cssContent = cssFiles.map((css) => `<style>${css.content}</style>`).join("\n");
          if (htmlContent.includes("</head>")) {
            htmlContent = htmlContent.replace("</head>", `${cssContent}</head>`);
          } else {
            htmlContent = htmlContent.replace("<html>", `<html><head>${cssContent}</head>`);
          }
        }

        // Inject JavaScript
        if (jsFiles.length > 0) {
          const jsContent = jsFiles.map((js) => `<script>${js.content}</script>`).join("\n");
          if (htmlContent.includes("</body>")) {
            htmlContent = htmlContent.replace("</body>", `${jsContent}</body>`);
          } else {
            htmlContent += jsContent;
          }
        }

        setError("");
        return htmlContent;
      } catch {
        setError("Failed to generate preview");
        return "<div>Error generating preview</div>";
      }
    };

    setIframeContent(generatePreview());
  }, [files, mainFile]);

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case "phone":
        return "375px";
      case "laptop":
        return "650px";
      default:
        return "100%";
    }
  };

  const getDeviceClass = () => {
    switch (deviceSize) {
      case "phone":
        return "mx-auto border-4 border-gray-300 rounded-3xl overflow-hidden";
      case "laptop":
        return "mx-auto border-4 border-gray-400 rounded-lg overflow-hidden";
      default:
        return "";
    }
  };

  if (error) {
    return (
      <div className="h-full bg-neutral-900 flex items-center justify-center text-red-400">
        <div className="text-center">
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full bg-neutral-900 flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <div className="text-lg mb-2">No Project</div>
          <div className="text-sm">Generate a project to see preview</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-800 scrollbarwidth">
      <div className={`${getDeviceClass()} scrollbarwidth`} style={{ width: getDeviceWidth(), height: "100%" }}>
        <iframe
          srcDoc={iframeContent}
          title="Live Preview"
          className="w-full h-full border scrollbarwidt bg-white"
          sandbox="allow-same-origin allow-scripts"
          loading="lazy"
        />
      </div>
    </div>
  );
}
