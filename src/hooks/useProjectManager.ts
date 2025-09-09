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

      console.log("Parsed project data:", projectData);

      // Create project in backend
      const project = await api.createProject({
        name: projectData.projectName,
        description: `Project generated from prompt: ${prompt}`,
        language: "html",
        tags: ["ai-generated"],
        isPublic: false,
      });

      console.log("Project created:", project);

      // Check if project was created successfully and has an ID
      if (!project || !project._id) {
        throw new Error("Failed to create project: No project ID returned");
      }

      const createdFiles = [];
      for (const file of projectData.files) {
        try {
          const createdFile = await api.createFile(project._id, {
            filename: file.filename,
            content: file.content,
            mimeType: `text/${file.language}`,
          });
          createdFiles.push(createdFile);
          console.log(`File created: ${file.filename}`);
        } catch (fileError) {
          console.error(`Failed to create file ${file.filename}:`, fileError);
          // Continue with other files even if one fails
        }
      }

      // If no files were created successfully, throw an error
      if (createdFiles.length === 0) {
        throw new Error("Failed to create any files for the project");
      }

      setCurrentProject(project);
      setFiles(createdFiles);

      return {
        projectId: project._id,
        files: createdFiles,
        mainFile: projectData.mainFile,
      };
    } catch (err) {
      console.error("Project generation failed:", err);

      // Provide more specific error messages
      if (err.message.includes("Validation failed")) {
        throw new Error("Project creation failed due to validation errors. Please try a different prompt.");
      } else if (err.message.includes("project ID")) {
        throw new Error("Failed to create project. Please try again.");
      } else {
        throw err;
      }
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
