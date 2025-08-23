import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface ProgressUpdate {
  type: string;
  payload: any;
}

export function useSocket(url: string, userId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [logs, setLogs] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<ProgressUpdate | null>(null);

  // Add a log entry
  const addLog = useCallback((message: string) => {
    setLogs((prev) => [message, ...prev]); // newest on top
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socketInstance: Socket = io(url, {
      query: { userId },
      transports: ["websocket"],
    });

    setSocket(socketInstance);
    setStatus("Connecting...");

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setStatus(`Connected! Socket ID: ${socketInstance.id}`);
      addLog("✅ Client connected to server.");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setStatus("Disconnected");
      addLog("❌ Client disconnected from server.");
    });

    socketInstance.on("connect_error", (err: any) => {
      setIsConnected(false);
      setStatus(`Connection error: ${err.message}`);
      addLog(`⚠️ Connection failed: ${err.message}`);
      console.error("Connection Error:", err);
    });

    // Listen for progress_update
    socketInstance.on("progress_update", (data: ProgressUpdate) => {
      console.log("📩 Received progress_update:", data);
      setProgressData(data)
      addLog(
        `Update → type: ${data.type}, payload: ${JSON.stringify(data.payload)}`
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url, userId, addLog]);

  return { socket, isConnected, progressData };
}

// const handleSendPrompt = async () => {
//     if (!prompt.trim() || !canRequest || isGenerating || !isAuthenticated)
//       return;

//     setIsGenerating(true);
//     const currentPrompt = prompt;
//     setPrompt(""); // Clear the input field

//     try {
//       // Add the prompt to history immediately
//       const newHistoryItem: PromptHistory = {
//         prompt: currentPrompt,
//         response: "🔄 Generating your landing page...",
//         timestamp: new Date(),
//       };
//       setPromptHistory((prev) => [...prev, newHistoryItem]);

//       const project = await generateProjectFromPrompt(currentPrompt);

//       // Update the history with the successful response
//       setPromptHistory((prev) =>
//         prev.map((item, index) =>
//           index === prev.length - 1
//             ? {
//                 ...item,
//                 response:
//                   "✅ Landing page generated successfully! Check the Code and Preview tabs.",
//               }
//             : item
//         )
//       );

//       setMainFile(project.mainFile);
//       setCurrentFile(project.mainFile);
//       setActiveTab("code");
//     } catch (error: any) {
//       console.error("Project generation failed:", error);

//       // Update the history with the error response
//       let errorMessage = "❌ Failed to generate project. Please try again.";

//       if (error.message.includes("JSON")) {
//         errorMessage =
//           "❌ The AI response format was unexpected. Please try again with a different prompt.";
//       } else if (error.message.includes("token")) {
//         errorMessage =
//           "❌ Token limit exceeded. Please try again later or upgrade your plan.";
//       } else if (error.message) {
//         errorMessage = `❌ ${error.message}`;
//       }

//       setPromptHistory((prev) =>
//         prev.map((item, index) =>
//           index === prev.length - 1 ? { ...item, response: errorMessage } : item
//         )
//       );
//     } finally {
//       setIsGenerating(false);
//     }
//   };
