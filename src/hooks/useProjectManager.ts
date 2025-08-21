// // hooks/useProjectManager.ts
import { useState, useCallback } from "react";
import { api } from "@/lib/api";

interface GeneratedProject {
  projectId: string;
  files: Array<{
    filename: string;
    content: string;
    language: string;
  }>;
  mainFile: string;
}

export function useProjectManager() {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Parser for plain text AI responses ---
  const parseFilesFromResponse = (rawResponse: any) => {
    try {
      const response = typeof rawResponse === "string" ? rawResponse : rawResponse.response;

      console.log("Raw AI response string:", response);

      // Match blocks like: --- filename.ext ---\n<content>
      const fileRegex = /---\s*([\w.\-]+)\s*---\s*([\s\S]*?)(?=(?:---\s*[\w.\-]+\s*---|$))/g;

      const parsedFiles: any[] = [];
      let match;

      while ((match = fileRegex.exec(response)) !== null) {
        const filename = match[1].trim();
        const content = match[2].trim();

        if (!content) {
          console.warn(`⚠️ Skipping empty file: ${filename}`);
          continue;
        }

        let language = "text";
        if (filename.endsWith(".html")) language = "html";
        if (filename.endsWith(".css")) language = "css";
        if (filename.endsWith(".js")) language = "javascript";

        parsedFiles.push({ filename, content, language });
      }

      if (parsedFiles.length === 0) {
        throw new Error("No valid files parsed from AI response");
      }

      return {
        projectName: "Generated Project",
        files: parsedFiles,
        mainFile: parsedFiles.find((f) => f.filename === "index.html")?.filename || parsedFiles[0].filename,
      };
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err);
      throw err;
    }
  };

  const generateProjectFromPrompt = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    try {
      const systemPrompt = `
        Create a simple project for: "${prompt}".
        Return plain text in this format (NO JSON, NO markdown fences):

        --- index.html ---
        <!DOCTYPE html>
        <html>...</html>

        --- styles.css ---
        body { ... }

        --- script.js ---
        console.log("hello");
      `;

      const aiResponse = await api.generateAIResponse(systemPrompt, "generate");
      const projectData = parseFilesFromResponse(aiResponse);

      // Create project in backend
      const project = await api.createProject({
        name: projectData.projectName,
        description: `Project generated from prompt: ${prompt}`,
        language: "html",
        tags: ["ai-generated"],
        isPublic: false,
      });

      const createdFiles = [];
      for (const file of projectData.files) {
        const createdFile = await api.createFile(project._id, {
          filename: file.filename,
          content: file.content,
          mimeType: `text/${file.language}`,
        });
        createdFiles.push(createdFile);
      }

      setCurrentProject(project);
      setFiles(createdFiles);

      return {
        projectId: project._id,
        files: createdFiles,
        mainFile: "index.html",
      };
    } catch (err) {
      console.error("Project generation failed:", err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const loadProjectFiles = useCallback(async (projectId: string) => {
    try {
      const projectFiles = await api.getProjectFiles(projectId);
      setFiles(projectFiles);
      return projectFiles;
    } catch (err) {
      console.error("Failed to load project files:", err);
      throw err;
    }
  }, []);

  return {
    currentProject,
    files,
    isGenerating,
    generateProjectFromPrompt,
    loadProjectFiles,
    setCurrentProject,
    setFiles,
  };
}


// hooks/useProjectManager.ts
// import { useState, useCallback } from "react";
// import { api } from "@/lib/api";

// interface GeneratedProject {
//   projectId: string;
//   files: Array<{
//     filename: string;
//     content: string;
//     language: string;
//   }>;
//   mainFile: string;
// }

// export function useProjectManager() {
//   const [currentProject, setCurrentProject] = useState<any>(null);
//   const [files, setFiles] = useState<any[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // --- Parser for plain text AI responses ---
//   const parseFilesFromResponse = (aiResponse: any) => {
//     try {
//       console.log("Raw AI response object:", aiResponse);

//       // Extract the actual response content from the AI response object
//       const responseContent = aiResponse.response || aiResponse;

//       console.log("Response content:", responseContent);

//       // Split by file markers
//       const fileBlocks = responseContent
//         .split(/---\s*/g)
//         .map((block: string) => block.trim())
//         .filter((block: string) => block.length > 0);

//       const parsedFiles: any[] = [];

//       for (let i = 0; i < fileBlocks.length; i++) {
//         const block = fileBlocks[i];

//         // Check if this block contains a file
//         if (block.includes(".html") || block.includes(".css") || block.includes(".js")) {
//           const lines = block.split("\n");
//           const filenameLine = lines[0].trim();

//           // Extract filename properly - keep the extension
//           let filename = filenameLine;

//           // Clean up the filename (remove any extra text after the filename)
//           if (filename.includes(" ")) {
//             filename = filename.split(" ")[0]; // Take only the first word
//           }

//           // Ensure it has a proper extension
//           if (!filename.endsWith(".html") && !filename.endsWith(".css") && !filename.endsWith(".js")) {
//             if (filenameLine.toLowerCase().includes("html")) filename = "index.html";
//             else if (filenameLine.toLowerCase().includes("css")) filename = "styles.css";
//             else if (filenameLine.toLowerCase().includes("js")) filename = "script.js";
//             else filename = `file-${i}.txt`;
//           }

//           // Get the content (all lines after the filename)
//           const content = lines.slice(1).join("\n").trim();

//           // Determine language from filename
//           let language = "text";
//           if (filename.endsWith(".html")) language = "html";
//           if (filename.endsWith(".css")) language = "css";
//           if (filename.endsWith(".js")) language = "javascript";

//           // Validate content is not empty
//           const validatedContent = content || getDefaultContent(filename, language);

//           parsedFiles.push({
//             filename,
//             content: validatedContent,
//             language,
//           });
//         }
//       }

//       // If no files were parsed but we have content, create a default structure
//       if (parsedFiles.length === 0) {
//         console.warn("No files parsed, creating default structure");
//         return createDefaultProject(responseContent);
//       }

//       // Ensure we have all required files
//       const hasHTML = parsedFiles.some((f) => f.filename.endsWith(".html"));
//       const hasCSS = parsedFiles.some((f) => f.filename.endsWith(".css"));
//       const hasJS = parsedFiles.some((f) => f.filename.endsWith(".js"));

//       if (!hasHTML) {
//         parsedFiles.unshift({
//           filename: "index.html",
//           content: getDefaultContent("index.html", "html"),
//           language: "html",
//         });
//       }

//       if (!hasCSS) {
//         parsedFiles.push({
//           filename: "styles.css",
//           content: getDefaultContent("styles.css", "css"),
//           language: "css",
//         });
//       }

//       if (!hasJS) {
//         parsedFiles.push({
//           filename: "script.js",
//           content: getDefaultContent("script.js", "javascript"),
//           language: "javascript",
//         });
//       }

//       return {
//         projectName: "GeneratedProject",
//         files: parsedFiles,
//         mainFile: "index.html",
//       };
//     } catch (err) {
//       console.error("❌ Failed to parse AI response:", err);
//       return createDefaultProject("Fallback project due to parsing error");
//     }
//   };

//   // Helper function to get default content for files
//   const getDefaultContent = (filename: string, language: string): string => {
//     switch (language) {
//       case "html":
//         return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Generated Project</title>
//     <link rel="stylesheet" href="styles.css">
// </head>
// <body>
//     <div class="container">
//         <h1>Welcome to Your Project</h1>
//         <p>This is a generated landing page.</p>
//     </div>
//     <script src="script.js"></script>
// </body>
// </html>`;

//       case "css":
//         return `body {
//     margin: 0;
//     padding: 20px;
//     font-family: Arial, sans-serif;
//     line-height: 1.6;
//     color: #333;
//     background-color: #f4f4f4;
// }

// .container {
//     max-width: 1200px;
//     margin: 0 auto;
//     padding: 20px;
// }

// h1 {
//     color: #2c3e50;
//     margin-bottom: 1rem;
// }

// p {
//     margin-bottom: 1rem;
// }`;

//       case "javascript":
//         return `console.log("Project loaded successfully");

// // Smooth scrolling for navigation
// document.addEventListener('DOMContentLoaded', function() {
//     const links = document.querySelectorAll('a[href^="#"]');
//     links.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault();
//             const target = document.querySelector(this.getAttribute('href'));
//             if (target) {
//                 target.scrollIntoView({ behavior: 'smooth' });
//             }
//         });
//     });
// });`;

//       default:
//         return "// Default content";
//     }
//   };

//   // Create default project structure
//   const createDefaultProject = (prompt: string) => {
//     return {
//       projectName: "GeneratedProject",
//       files: [
//         {
//           filename: "index.html",
//           content: getDefaultContent("index.html", "html"),
//           language: "html",
//         },
//         {
//           filename: "styles.css",
//           content: getDefaultContent("styles.css", "css"),
//           language: "css",
//         },
//         {
//           filename: "script.js",
//           content: getDefaultContent("script.js", "javascript"),
//           language: "javascript",
//         },
//       ],
//       mainFile: "index.html",
//     };
//   };

//   const generateProjectFromPrompt = useCallback(async (prompt: string): Promise<GeneratedProject> => {
//     setIsGenerating(true);
//     try {
//       const systemPrompt = `Create a complete landing page project for: "${prompt}".
// Return the files in this exact format:

// --- index.html ---
// <!DOCTYPE html>
// <html>...</html>

// --- styles.css ---
// body { ... }

// --- script.js ---
// console.log("hello");

// Make sure all files are complete with proper closing tags and semicolons.`;

//       const aiResponse = await api.generateAIResponse(systemPrompt, "generate");

//       // Pass the entire AI response object to the parser
//       const projectData = parseFilesFromResponse(aiResponse);

//       // Create project in backend
//       const project = await api.createProject({
//         name: projectData.projectName,
//         description: `Project generated from prompt: ${prompt}`,
//         language: "html",
//         tags: ["ai-generated"],
//         isPublic: false,
//       });

//       // Create all files - validate content before sending
//       const createdFiles = [];
//       for (const file of projectData.files) {
//         // Ensure content is not empty
//         const validatedContent = file.content.trim() || getDefaultContent(file.filename, file.language);

//         console.log(`Creating file: ${file.filename} with content length: ${validatedContent.length}`);

//         const createdFile = await api.createFile(project._id, {
//           filename: file.filename,
//           content: validatedContent,
//           mimeType: `text/${file.language}`,
//         });
//         createdFiles.push(createdFile);
//       }

//       setCurrentProject(project);
//       setFiles(createdFiles);

//       return {
//         projectId: project._id,
//         files: createdFiles,
//         mainFile: projectData.mainFile,
//       };
//     } catch (error) {
//       console.error("Project generation failed:", error);
//       throw error;
//     } finally {
//       setIsGenerating(false);
//     }
//   }, []);

//   const loadProjectFiles = useCallback(async (projectId: string) => {
//     try {
//       const projectFiles = await api.getProjectFiles(projectId);
//       setFiles(projectFiles);
//       return projectFiles;
//     } catch (error) {
//       console.error("Failed to load project files:", error);
//       throw error;
//     }
//   }, []);

//   return {
//     currentProject,
//     files,
//     isGenerating,
//     generateProjectFromPrompt,
//     loadProjectFiles,
//     setCurrentProject,
//     setFiles,
//   };
// }
