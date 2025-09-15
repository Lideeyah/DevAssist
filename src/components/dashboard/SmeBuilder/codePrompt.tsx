// import { useState, useEffect } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import { GitMerge, Link, Mic, MonitorSmartphone, Scaling, SendHorizonal, Undo2, User, Code, Monitor, FolderOpen } from "lucide-react";
// import SplitPane from "react-split-pane";
// import { Button } from "@/components/ui/button";
// import { api } from "@/lib/api";
// import { useProjectManager } from "@/hooks/useProjectManager";
// import LivePreview from "./livePreview";
// import EditCode from "./editCode";
// import { OnboardState } from "@/types/onboarding";
// import { useAuth } from "@/hooks/use-auth";
// import { useNavigate } from "react-router";

// interface PromptHistory {
//   prompt: string;
//   response: string;
//   timestamp: Date;
// }

// export default function CodePrompt() {
//   // ============ STATE HOOKS ============
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [deviceSize, setDeviceSize] = useState<"desktop" | "laptop" | "phone">("desktop");
//   const [splitSize, setSplitSize] = useState(310);
//   const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
//   const [prompt, setPrompt] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [tokenUsage, setTokenUsage] = useState({
//     used: 0,
//     limit: 10000,
//     remaining: 10000,
//   });
//   const [canRequest, setCanRequest] = useState(true);
//   const [currentFile, setCurrentFile] = useState<string>("");
//   const [mainFile, setMainFile] = useState<string>("index.html");
//   const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);

//   // ============ AUTH & NAVIGATION HOOKS ============
//   const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   // ============ PROJECT HOOKS ============
//   const { currentProject, files, generateProjectFromPrompt, setFiles } = useProjectManager();

//   // ============ SPEECH RECOGNITION HOOKS ============
//   const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

//   // ============ ONBOARDING DATA ============
//   const onboardingData: OnboardState = JSON.parse(localStorage.getItem("onboard:v1") ?? "{}");

//   // ============ USE EFFECTS ============

//   // Debug effect - log auth state changes
//   useEffect(() => {
//     console.log("Auth state changed:", { isAuthenticated, authLoading, user });
//   }, [isAuthenticated, authLoading, user]);

//   // Load token usage when authenticated
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       console.log("User authenticated, loading token usage...");
//       loadTokenUsage();
//     }
//   }, [isAuthenticated, user]);

//   // Speech recognition effect - update prompt when transcript changes
//   useEffect(() => {
//     if (transcript) {
//       setPrompt(transcript);
//     }
//   }, [transcript]);

//   // ============ EVENT HANDLERS ============

//   const handleSpeechClick = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//     } else {
//       resetTranscript();
//       SpeechRecognition.startListening({ continuous: true, language: "en-US" });
//     }
//   };

//   const loadTokenUsage = async () => {
//     try {
//       console.log("Loading token usage...");

//       // Try to get token usage from user object first (it might already be there)
//       if (user?.tokenUsage) {
//         console.log("Using token usage from user object:", user.tokenUsage);

//         // Use the daily token usage from the user object
//         const dailyUsage = user.tokenUsage.daily || {
//           tokensUsed: 0,
//           requestCount: 0,
//           date: new Date().toISOString().split("T")[0],
//         };

//         setTokenUsage({
//           used: dailyUsage.tokensUsed || 0,
//           limit: 10000, // Your daily limit
//           remaining: 10000 - (dailyUsage.tokensUsed || 0),
//         });

//         // You can make requests if you have tokens remaining
//         const canMakeRequest = 10000 - (dailyUsage.tokensUsed || 0) > 0;
//         setCanRequest(canMakeRequest);
//         console.log("Can make requests:", canMakeRequest, "Remaining tokens:", 10000 - (dailyUsage.tokensUsed || 0));
//         return;
//       }

//       // Fallback to API call
//       const usage = await api.getTokenUsage();
//       console.log("Token usage from API:", usage);
//       setTokenUsage(usage.daily);

//       const canRequestResponse = await api.canMakeAIRequest();
//       setCanRequest(canRequestResponse.canMakeRequest);
//     } catch (error: any) {
//       console.error("Failed to load token usage:", error);

//       // Set safe defaults instead of redirecting
//       setTokenUsage({
//         used: 0,
//         limit: 10000,
//         remaining: 10000,
//       });
//       setCanRequest(true);
//     }
//   };

//   const handleSendPrompt = async () => {
//     if (!prompt.trim() || !canRequest || isGenerating || !isAuthenticated) return;

//     setIsGenerating(true);
//     const currentPrompt = prompt;
//     setPrompt("");

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
//                 response: "✅ Landing page generated successfully! Check the Code and Preview tabs.",
//               }
//             : item
//         )
//       );

//       setMainFile(project.mainFile);
//       setCurrentFile(project.mainFile);
//       setActiveTab("code");
//     } catch (error: any) {
//       console.error("Project generation failed:", error);

//       // Handle specific error types
//       let errorMessage = "Failed to generate project. Please try again.";

//       if (error.isValidationError) {
//         errorMessage = "Validation error: " + (error.validationErrors?.[0]?.message || error.message);
//       } else if (error.message.includes("JSON")) {
//         errorMessage = "The AI response format was unexpected. Please try again with a different prompt.";
//       } else if (error.message.includes("token")) {
//         errorMessage = "Token limit exceeded. Please try again later or upgrade your plan.";
//       } else if (error.message.includes("Validation failed")) {
//         errorMessage = "Project validation failed. Please try a different prompt.";
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       setPromptHistory((prev) => prev.map((item, index) => (index === prev.length - 1 ? { ...item, response: `❌ ${errorMessage}` } : item)));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleFileSelect = (filename: string) => {
//     setCurrentFile(filename);
//   };

//   const handleFileUpdate = async (filename: string, content: string) => {
//     if (!currentProject) return;

//     try {
//       await api.updateFile(currentProject._id, filename, content);
//       setFiles((prev) => prev.map((f) => (f.filename === filename ? { ...f, content } : f)));
//     } catch (error: any) {
//       console.error("Failed to update file:", error);
//     }
//   };

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//     setSplitSize(isFullScreen ? 310 : 0);
//   };

//   const toggleDeviceSize = () => {
//     const sizes: ("desktop" | "laptop" | "phone")[] = ["desktop", "laptop", "phone"];
//     const currentIndex = sizes.indexOf(deviceSize);
//     const nextIndex = (currentIndex + 1) % sizes.length;
//     setDeviceSize(sizes[nextIndex]);
//   };

//   const handleSplitChange = (newSize: number) => {
//     setSplitSize(newSize);
//     setIsFullScreen(newSize < 10);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && e.ctrlKey) {
//       e.preventDefault();
//       handleSendPrompt();
//     }
//   };

//   // ============ DERIVED VALUES ============
//   const usagePercentage = (tokenUsage.used / tokenUsage.limit) * 100;
//   const isLowOnTokens = usagePercentage > 80;

//   // ============ RENDER GUARDS ============

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser does not support speech recognition.</span>;
//   }

//   if (authLoading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-75px)]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <span className="ml-3 text-neutral-400">Checking authentication...</span>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-75px)]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-neutral-400">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   // ============ MAIN RENDER ============
//   return (
//     <div className="max-h-full h-[calc(100vh-75px)] w-full flex overflow-hidden">
//       {activeTab === "preview" ? (
//         <SplitPane
//           split="vertical"
//           minSize={isFullScreen ? 0 : 200}
//           maxSize={isFullScreen ? 0 : 70}
//           size={splitSize}
//           defaultSize={35}
//           onChange={handleSplitChange}
//           className="!overflow-visible"
//         >
//           {/* Left - Code Prompt */}
//           {!isFullScreen ? (
//             <div className="flex flex-col w-full justify-end max-h-full h-[calc(100vh-78px)] px-4 py-2">
//               <div className="overflow-auto flex flex-col justify-between h-full">
//                 {/* User Info & Token Usage */}
//                 <div className="">
//                   <div className="mb-4 top-0 p-3 bg-neutral-800 rounded-sm border border-neutral-700">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center justify-between w-full">
//                         <div className="flex items-center gap-2 w-full">
//                           <User size={14} className="text-blue-400" />
//                           <span className="text-sm font-semibold text-neutral-300">{user?.username || "Guest"}</span>
//                         </div>
//                         <div className="w-full justify-end flex">
//                           <span className="text-[.65rem] text-blue-600 font-bold uppercase bg-background/80 px-4 rounded-sm p-2">
//                             {onboardingData.path?.selected || "User"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-center text-xs mb-1">
//                       <span className="text-neutral-400">
//                         Tokens: {tokenUsage.used}/{tokenUsage.limit}
//                       </span>
//                       <span className={isLowOnTokens ? "text-red-400" : "text-green-400"}>{Math.round(usagePercentage)}%</span>
//                     </div>
//                     <div className="w-full bg-neutral-700 rounded-full h-1.5">
//                       <div
//                         className={`h-1.5 rounded-full transition-all ${isLowOnTokens ? "bg-red-500" : "bg-blue-500"}`}
//                         style={{ width: `${usagePercentage}%` }}
//                       />
//                     </div>
//                     {!canRequest && <div className="text-xs text-red-400 mt-2">Daily limit reached</div>}
//                   </div>

//                   {/* Prompt History Display */}
//                   <div className="flex-1 overflow-y-auto mb-4">
//                     {promptHistory.map((item, index) => (
//                       <div key={index} className="mb-4">
//                         {/* Prompt Display */}
//                         <div className="border rounded-sm mb-2 border-neutral-700">
//                           <div className="bg-neutral-900 w-full min-h-[60px] p-3 text-sm">
//                             <div className="text-neutral-200 whitespace-pre-wrap">{item.prompt}</div>
//                           </div>
//                         </div>

//                         {/* AI Response Display */}
//                         <div className="border rounded-sm mb-4 border-neutral-700">
//                           <div className="bg-neutral-900 w-full min-h-[80px] p-3 text-sm">
//                             {item.response.includes("🔄") ? (
//                               <div className="flex items-center text-blue-400">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
//                                 {item.response}
//                               </div>
//                             ) : (
//                               <div className="text-neutral-200 whitespace-pre-wrap">{item.response}</div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Input Area */}
//                 <div className="flex justify-end">
//                   <div className="w-full relative group">
//                     <textarea
//                       value={prompt}
//                       onChange={(e) => setPrompt(e.target.value)}
//                       onKeyDown={handleKeyPress}
//                       disabled={!canRequest || isGenerating || !isAuthenticated}
//                       className="w-full rounded-sm p-2 text-sm font-medium placeholder:text-neutral-500 h-[9rem] transition-all duration-200 focus:border-blue-500 border-neutral-600 border bg-neutral-900 group disabled:opacity-50 disabled:cursor-not-allowed resize-none"
//                       placeholder={
//                         !isAuthenticated
//                           ? "Please login to use AI features"
//                           : !canRequest
//                           ? "Daily token limit exceeded"
//                           : "Describe your landing page (e.g., 'Create a modern landing page for a tech startup')"
//                       }
//                     />
//                     <div className="absolute bottom-3 right-3">
//                       <Button
//                         onClick={handleSendPrompt}
//                         disabled={!prompt.trim() || !canRequest || isGenerating || !isAuthenticated}
//                         size="sm"
//                         className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-400"
//                       >
//                         {isGenerating ? (
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         ) : (
//                           <SendHorizonal size={16} />
//                         )}
//                       </Button>
//                     </div>
//                     <div className="absolute bottom-3 left-2 flex items-center gap-2">
//                       <Link size={20} className="cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors" />
//                       <Mic
//                         onClick={handleSpeechClick}
//                         size={20}
//                         className={`cursor-pointer transition-colors ${
//                           listening ? "text-green-600 animate-pulse-scale" : "text-neutral-400 hover:text-blue-500"
//                         }`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="hidden"></div>
//           )}

//           {/* Right - Preview section */}
//           <div className={`w-full pr-5 max-h-full h-[calc(100vh-78px)] ${isFullScreen ? "pl-5" : ""}`}>
//             <div className="space-y-3">
//               <div className="flex items-center w-fit rounded-full bg-neutral-900 p-1 border border-neutral-700">
//                 <button
//                   className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
//                     activeTab === "preview" ? "bg-neutral-900 text-neutral-400" : "bg-black text-white"
//                   }`}
//                   onClick={() => setActiveTab("code")}
//                 >
//                   <Code size={14} className="mr-2" />
//                   Code
//                 </button>
//                 <button
//                   className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
//                     activeTab === "preview" ? "bg-black text-blue-500" : "bg-neutral-900 text-neutral-400"
//                   }`}
//                   onClick={() => setActiveTab("preview")}
//                 >
//                   <Monitor size={14} className="mr-2" />
//                   Preview
//                 </button>
//               </div>

//               <div className="w-full">
//                 <div className="flex justify-between w-full items-center gap-4">
//                   <Undo2 size={17} className="cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors" />
//                   <div className="flex relative w-full">
//                     <div className="absolute top-2 left-3 text-neutral-400">
//                       <GitMerge size={13} />
//                     </div>
//                     <input
//                       type="text"
//                       className="border rounded-full w-full h-[2rem] pl-10 text-sm bg-neutral-900 border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors text-neutral-300"
//                       value={currentProject ? `${currentProject.name}/` : "No project/"}
//                       readOnly
//                     />
//                   </div>
//                   <MonitorSmartphone
//                     size={17}
//                     className={`cursor-pointer transition-colors ${
//                       deviceSize !== "desktop" ? "text-blue-500" : "text-neutral-400 hover:text-blue-500"
//                     }`}
//                     onClick={toggleDeviceSize}
//                   />
//                   <Scaling
//                     size={17}
//                     className={`cursor-pointer transition-colors ${isFullScreen ? "text-blue-500" : "text-neutral-400 hover:text-blue-500"}`}
//                     onClick={toggleFullScreen}
//                   />
//                 </div>

//                 <div className="w-full border rounded-sm mt-4 border-neutral-700 h-[calc(100vh-198px)]">
//                   <LivePreview files={files} mainFile={mainFile} deviceSize={deviceSize} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </SplitPane>
//       ) : (
//         /* Code Editor when in code mode */
//         <div className="w-full h-full">
//           <div className="space-y-3 p-5">
//             <div className="flex items-center w-fit rounded-full bg-neutral-900 p-1 border border-neutral-700">
//               <button
//                 className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
//                   activeTab === "code" ? "bg-black text-white" : "bg-neutral-900 text-neutral-400"
//                 }`}
//                 onClick={() => setActiveTab("code")}
//               >
//                 <Code size={14} className="mr-2" />
//                 Code
//               </button>
//               <button
//                 className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
//                   activeTab === "preview" ? "bg-black text-blue-500" : "bg-neutral-900 text-neutral-400"
//                 }`}
//                 onClick={() => setActiveTab("preview")}
//               >
//                 <Monitor size={14} className="mr-2" />
//                 Preview
//               </button>
//             </div>

//             {files.length > 0 ? (
//               <div className="w-full h-full border border-neutral-700 rounded-sm">
//                 <EditCode files={files} currentFile={currentFile} onFileSelect={handleFileSelect} onFileUpdate={handleFileUpdate} />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-[calc(100vh-120px)] text-neutral-500">
//                 <div className="text-center">
//                   <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
//                   <p>No project files yet. Generate a project by entering a prompt!</p>
//                   <p className="text-sm mt-2">Try: "Create a modern landing page for a tech startup"</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { GitMerge, Link, Mic, MonitorSmartphone, Scaling, SendHorizonal, Undo2, User, Code, Monitor, FolderOpen } from "lucide-react";
import SplitPane from "react-split-pane";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useProjectManager } from "@/hooks/useProjectManager";
import LivePreview from "./livePreview";
import EditCode from "./editCode";
import { OnboardState } from "@/types/onboarding";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import SpitchSpeechToText from "./SpeachToText/spitchSpeechToText";

interface PromptHistory {
  prompt: string;
  response: string;
  timestamp: Date;
}

export default function CodePrompt() {
  // ============ STATE HOOKS ============
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deviceSize, setDeviceSize] = useState<"desktop" | "laptop" | "phone">("desktop");
  const [splitSize, setSplitSize] = useState(310);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenUsage, setTokenUsage] = useState({
    used: 0,
    limit: 10000,
    remaining: 10000,
  });
  const [canRequest, setCanRequest] = useState(true);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [mainFile, setMainFile] = useState<string>("index.html");
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // ============ AUTH & NAVIGATION HOOKS ============
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ============ PROJECT HOOKS ============
  const { currentProject, files, generateProjectFromPrompt, setFiles } = useProjectManager();

  // ============ ONBOARDING DATA ============
  const onboardingData: OnboardState = JSON.parse(localStorage.getItem("onboard:v1") ?? "{}");

  // ============ USE EFFECTS ============

  // Debug effect - log auth state changes
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, authLoading, user });
  }, [isAuthenticated, authLoading, user]);

  // Load token usage when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, loading token usage...");
      loadTokenUsage();
    }
  }, [isAuthenticated, user]);

  // Speech recognition effect - update prompt when transcript changes
  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

  // ============ EVENT HANDLERS ============

  const handleSpeechClick = () => {
    if (listening) {
      setListening(false);
    } else {
      setTranscript(""); // Clear previous transcript
      setListening(true);
    }
  };

  const handleTranscript = (newTranscript: string) => {
    if (newTranscript.trim() === "") {
      // Reset transcript and prompt when empty string is received
      setTranscript("");
      setPrompt("");
    } else {
      // Append new transcript text
      setTranscript((prev) => prev + " " + newTranscript);
      setPrompt((prev) => prev + " " + newTranscript);
    }
  };

  const loadTokenUsage = async () => {
    try {
      console.log("Loading token usage...");

      // Try to get token usage from user object first (it might already be there)
      if (user?.tokenUsage) {
        console.log("Using token usage from user object:", user.tokenUsage);

        // Use the daily token usage from the user object
        const dailyUsage = user.tokenUsage.daily || {
          tokensUsed: 0,
          requestCount: 0,
          date: new Date().toISOString().split("T")[0],
        };

        setTokenUsage({
          used: dailyUsage.tokensUsed || 0,
          limit: 10000, // Your daily limit
          remaining: 10000 - (dailyUsage.tokensUsed || 0),
        });

        // You can make requests if you have tokens remaining
        const canMakeRequest = 10000 - (dailyUsage.tokensUsed || 0) > 0;
        setCanRequest(canMakeRequest);
        console.log("Can make requests:", canMakeRequest, "Remaining tokens:", 10000 - (dailyUsage.tokensUsed || 0));
        return;
      }

      // Fallback to API call
      const usage = await api.getTokenUsage();
      console.log("Token usage from API:", usage);
      setTokenUsage(usage.daily);

      const canRequestResponse = await api.canMakeAIRequest();
      setCanRequest(canRequestResponse.canMakeRequest);
    } catch (error: any) {
      console.error("Failed to load token usage:", error);

      // Set safe defaults instead of redirecting
      setTokenUsage({
        used: 0,
        limit: 10000,
        remaining: 10000,
      });
      setCanRequest(true);
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim() || !canRequest || isGenerating || !isAuthenticated) return;

    setIsGenerating(true);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      // Add the prompt to history immediately
      const newHistoryItem: PromptHistory = {
        prompt: currentPrompt,
        response: "🔄 Generating your landing page...",
        timestamp: new Date(),
      };
      setPromptHistory((prev) => [...prev, newHistoryItem]);

      const project = await generateProjectFromPrompt(currentPrompt);

      // Update the history with the successful response
      setPromptHistory((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? {
                ...item,
                response: "✅ Landing page generated successfully! Check the Code and Preview tabs.",
              }
            : item
        )
      );

      setMainFile(project.mainFile);
      setCurrentFile(project.mainFile);
      setActiveTab("code");
    } catch (error: any) {
      console.error("Project generation failed:", error);

      // Handle specific error types
      let errorMessage = "Failed to generate project. Please try again.";

      if (error.isValidationError) {
        errorMessage = "Validation error: " + (error.validationErrors?.[0]?.message || error.message);
      } else if (error.message.includes("JSON")) {
        errorMessage = "The AI response format was unexpected. Please try again with a different prompt.";
      } else if (error.message.includes("token")) {
        errorMessage = "Token limit exceeded. Please try again later or upgrade your plan.";
      } else if (error.message.includes("Validation failed")) {
        errorMessage = "Project validation failed. Please try a different prompt.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setPromptHistory((prev) => prev.map((item, index) => (index === prev.length - 1 ? { ...item, response: `❌ ${errorMessage}` } : item)));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename);
  };

  const handleFileUpdate = async (filename: string, content: string) => {
    if (!currentProject) return;

    try {
      await api.updateFile(currentProject._id, filename, content);
      setFiles((prev) => prev.map((f) => (f.filename === filename ? { ...f, content } : f)));
    } catch (error: any) {
      console.error("Failed to update file:", error);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setSplitSize(isFullScreen ? 310 : 0);
  };

  const toggleDeviceSize = () => {
    const sizes: ("desktop" | "laptop" | "phone")[] = ["desktop", "laptop", "phone"];
    const currentIndex = sizes.indexOf(deviceSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setDeviceSize(sizes[nextIndex]);
  };

  const handleSplitChange = (newSize: number) => {
    setSplitSize(newSize);
    setIsFullScreen(newSize < 10);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  // ============ DERIVED VALUES ============
  const usagePercentage = (tokenUsage.used / tokenUsage.limit) * 100;
  const isLowOnTokens = usagePercentage > 80;

  // Check if browser supports media recording
  const browserSupportsRecording = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  // ============ RENDER GUARDS ============

  if (!browserSupportsRecording()) {
    return <span>Browser does not support audio recording.</span>;
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-75px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-neutral-400">Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-75px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // ============ MAIN RENDER ============
  return (
    <div className="max-h-full h-[calc(100vh-75px)] w-full flex overflow-hidden">
      {activeTab === "preview" ? (
        <SplitPane
          split="vertical"
          minSize={isFullScreen ? 0 : 200}
          maxSize={isFullScreen ? 0 : 70}
          size={splitSize}
          defaultSize={35}
          onChange={handleSplitChange}
          className="!overflow-visible"
        >
          {/* Left - Code Prompt */}
          {!isFullScreen ? (
            <div className="flex flex-col w-full justify-end max-h-full h-[calc(100vh-78px)] px-4 py-2">
              <div className="overflow-auto flex flex-col justify-between h-full">
                {/* User Info & Token Usage */}
                <div className="">
                  <div className="mb-4 top-0 p-3 bg-neutral-800 rounded-sm border border-neutral-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 w-full">
                          <User size={14} className="text-blue-400" />
                          <span className="text-sm font-semibold text-neutral-300">{user?.username || "Guest"}</span>
                        </div>
                        <div className="w-full justify-end flex">
                          <span className="text-[.65rem] text-blue-600 font-bold uppercase bg-background/80 px-4 rounded-sm p-2">
                            {onboardingData.path?.selected || "User"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-neutral-400">
                        Tokens: {tokenUsage.used}/{tokenUsage.limit}
                      </span>
                      <span className={isLowOnTokens ? "text-red-400" : "text-green-400"}>{Math.round(usagePercentage)}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isLowOnTokens ? "bg-red-500" : "bg-blue-500"}`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                    {!canRequest && <div className="text-xs text-red-400 mt-2">Daily limit reached</div>}
                  </div>

                  {/* Prompt History Display */}
                  <div className="flex-1 overflow-y-auto mb-4">
                    {promptHistory.map((item, index) => (
                      <div key={index} className="mb-4">
                        {/* Prompt Display */}
                        <div className="border rounded-sm mb-2 border-neutral-700">
                          <div className="bg-neutral-900 w-full min-h-[60px] p-3 text-sm">
                            <div className="text-neutral-200 whitespace-pre-wrap">{item.prompt}</div>
                          </div>
                        </div>

                        {/* AI Response Display */}
                        <div className="border rounded-sm mb-4 border-neutral-700">
                          <div className="bg-neutral-900 w-full min-h-[80px] p-3 text-sm">
                            {item.response.includes("🔄") ? (
                              <div className="flex items-center text-blue-400">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                {item.response}
                              </div>
                            ) : (
                              <div className="text-neutral-200 whitespace-pre-wrap">{item.response}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex justify-end">
                  <div className="w-full relative group">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={!canRequest || isGenerating || !isAuthenticated}
                      className="w-full rounded-sm p-2 text-sm overflow-auto font-medium placeholder:text-neutral-500 h-[9rem] transition-all duration-200 focus:border-blue-500 border-neutral-600 border bg-neutral-900 group disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                      placeholder={
                        !isAuthenticated
                          ? "Please login to use AI features"
                          : !canRequest
                          ? "Daily token limit exceeded"
                          : "Describe your landing page (e.g., 'Create a modern landing page for a tech startup')"
                      }
                    />
                    <div className="absolute bottom-3 right-3">
                      <Button
                        onClick={handleSendPrompt}
                        disabled={!prompt.trim() || !canRequest || isGenerating || !isAuthenticated}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-400"
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <SendHorizonal size={16} />
                        )}
                      </Button>
                    </div>
                    <div className="absolute bottom-1 left-2 flex items-center">
                      <Link size={20} className="cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors" />
                      <SpitchSpeechToText
                        onTranscript={handleTranscript}
                        language="en" // Set to the language you're speaking
                        autoTranslate={true} // Enable translation to English
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden"></div>
          )}

          {/* Right - Preview section */}
          <div className={`w-full pr-5 max-h-full h-[calc(100vh-78px)] ${isFullScreen ? "pl-5" : ""}`}>
            <div className="space-y-3">
              <div className="flex items-center w-fit rounded-full bg-neutral-900 p-1 border border-neutral-700">
                <button
                  className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
                    activeTab === "preview" ? "bg-neutral-900 text-neutral-400" : "bg-black text-white"
                  }`}
                  onClick={() => setActiveTab("code")}
                >
                  <Code size={14} className="mr-2" />
                  Code
                </button>
                <button
                  className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
                    activeTab === "preview" ? "bg-black text-blue-500" : "bg-neutral-900 text-neutral-400"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  <Monitor size={14} className="mr-2" />
                  Preview
                </button>
              </div>

              <div className="w-full">
                <div className="flex justify-between w-full items-center gap-4">
                  <Undo2 size={17} className="cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors" />
                  <div className="flex relative w-full">
                    <div className="absolute top-2 left-3 text-neutral-400">
                      <GitMerge size={13} />
                    </div>
                    <input
                      type="text"
                      className="border rounded-full w-full h-[2rem] pl-10 text-sm bg-neutral-900 border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors text-neutral-300"
                      value={currentProject ? `${currentProject.name}/` : "No project/"}
                      readOnly
                    />
                  </div>
                  <MonitorSmartphone
                    size={17}
                    className={`cursor-pointer transition-colors ${
                      deviceSize !== "desktop" ? "text-blue-500" : "text-neutral-400 hover:text-blue-500"
                    }`}
                    onClick={toggleDeviceSize}
                  />
                  <Scaling
                    size={17}
                    className={`cursor-pointer transition-colors ${isFullScreen ? "text-blue-500" : "text-neutral-400 hover:text-blue-500"}`}
                    onClick={toggleFullScreen}
                  />
                </div>

                <div className="w-full border rounded-sm mt-4 border-neutral-700 h-[calc(100vh-198px)]">
                  <LivePreview files={files} mainFile={mainFile} deviceSize={deviceSize} />
                </div>
              </div>
            </div>
          </div>
        </SplitPane>
      ) : (
        /* Code Editor when in code mode */
        <div className="w-full h-full">
          <div className="space-y-3 p-5">
            <div className="flex items-center w-fit rounded-full bg-neutral-900 p-1 border border-neutral-700">
              <button
                className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
                  activeTab === "code" ? "bg-black text-white" : "bg-neutral-900 text-neutral-400"
                }`}
                onClick={() => setActiveTab("code")}
              >
                <Code size={14} className="mr-2" />
                Code
              </button>
              <button
                className={`text-sm font-medium cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center transition-all ${
                  activeTab === "preview" ? "bg-black text-blue-500" : "bg-neutral-900 text-neutral-400"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                <Monitor size={14} className="mr-2" />
                Preview
              </button>
            </div>

            {files.length > 0 ? (
              <div className="w-full h-full border border-neutral-700 rounded-sm">
                <EditCode files={files} currentFile={currentFile} onFileSelect={handleFileSelect} onFileUpdate={handleFileUpdate} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-120px)] text-neutral-500">
                <div className="text-center">
                  <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No project files yet. Generate a project by entering a prompt!</p>
                  <p className="text-sm mt-2">Try: "Create a modern landing page for a tech startup"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
