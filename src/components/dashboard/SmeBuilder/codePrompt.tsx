import { useState, useEffect } from "react";
import {
  GitMerge,
  Link,
  MonitorSmartphone,
  Scaling,
  SendHorizonal,
  Undo2,
  User,
  Code,
  Monitor,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  History,
  Wand2,
} from "lucide-react";
import SplitPane from "react-split-pane";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useProjectManager } from "@/hooks/useProjectManager";
import LivePreview from "./livePreview";
import EditCode from "./editCode";
import { OnboardState } from "@/types/onboarding";
import { useAuth } from "@/hooks/use-auth";
import SpitchSpeechToText from "./SpeachToText/spitchSpeechToText";
import ConversationHistory, { Conversation } from "./ConversationHistory";

interface PromptHistory {
  prompt: string;
  response: string;
  timestamp: Date;
}

interface File {
  filename: string;
  content: string;
  mimeType: string;
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
  const [transcript, setTranscript] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showConversationSidebar, setShowConversationSidebar] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "success" | "error">("idle");

  // ============ AUTH & NAVIGATION HOOKS ============
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // ============ PROJECT HOOKS ============
  const { currentProject, files, generateProjectFromPrompt, setFiles } = useProjectManager();

  // ============ ONBOARDING DATA ============
  const onboardingData: OnboardState = JSON.parse(localStorage.getItem("onboard:v1") ?? "{}");

  // ============ USE EFFECTS ============

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsedConversations.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          promptHistory: conv.promptHistory.map((ph: any) => ({
            ...ph,
            timestamp: new Date(ph.timestamp),
          })),
        }));

        setConversations(conversationsWithDates);

        // If there are conversations, set the last one as active
        if (conversationsWithDates.length > 0) {
          setActiveConversationId(conversationsWithDates[conversationsWithDates.length - 1].id);
          loadConversation(conversationsWithDates[conversationsWithDates.length - 1].id);
        }
      } catch (error) {
        console.error("Failed to parse saved conversations:", error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

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

  // ============ CONVERSATION MANAGEMENT ============

  // Function to load a specific conversation
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setFiles(conversation.project.files);
      setMainFile(conversation.project.mainFile);
      setCurrentFile(conversation.project.mainFile);
      setPromptHistory(conversation.promptHistory || []);
      setActiveTab("preview");
    }
  };

  // Function to create a new conversation
  const createNewConversation = (prompt: string, project: any, history: PromptHistory[]) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      prompt,
      timestamp: new Date(),
      project: {
        files: project.files,
        mainFile: project.mainFile,
      },
      promptHistory: history,
    };

    setConversations((prev) => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  };

  // Function to delete a conversation
  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));

    // If we're deleting the active conversation, switch to another one or clear state
    if (activeConversationId === conversationId) {
      const remainingConversations = conversations.filter((c) => c.id !== conversationId);
      if (remainingConversations.length > 0) {
        loadConversation(remainingConversations[remainingConversations.length - 1].id);
      } else {
        setActiveConversationId(null);
        setFiles([]);
        setMainFile("index.html");
        setCurrentFile("");
        setPromptHistory([]);
      }
    }
  };

  // ============ EVENT HANDLERS ============

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
    setGenerationStatus("generating");
    const currentPrompt = prompt;
    setPrompt("");

    try {
      // Add the prompt to history immediately
      const newHistoryItem: PromptHistory = {
        prompt: currentPrompt,
        response: "🔄 Generating project...",
        timestamp: new Date(),
      };
      const updatedHistory = [...promptHistory, newHistoryItem];
      setPromptHistory(updatedHistory);

      const project = await generateProjectFromPrompt(currentPrompt);

      // Create and save the new conversation
      createNewConversation(currentPrompt, project, updatedHistory);

      // Update the history with the successful response
      setPromptHistory((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? {
                ...item,
                response: "✅ Project generated successfully! Check the Code and Preview tabs.",
              }
            : item
        )
      );

      setGenerationStatus("success");
      setMainFile(project.mainFile);
      setCurrentFile(project.mainFile);
      setActiveTab("code");

      // Reset success status after 3 seconds
      setTimeout(() => {
        setGenerationStatus("idle");
      }, 3000);
    } catch (error: any) {
      console.error("Project generation failed:", error);
      setGenerationStatus("error");

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

      // Reset error status after 5 seconds
      setTimeout(() => {
        setGenerationStatus("idle");
      }, 5000);
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

      // Update the conversation with the new file content
      if (activeConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  project: {
                    ...conv.project,
                    files: conv.project.files.map((f) => (f.filename === filename ? { ...f, content } : f)),
                  },
                }
              : conv
          )
        );
      }
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

  // ============ ENHANCED UX COMPONENTS ============

  const GeneratingStatus = () => (
    <div className="flex flex-col items-center animate-pulse justify-center py-6 mx-20 bg-neutral-800/50 rounded-lg border border-neutral-700 mb-4">
      <div className="relative">
        <div className="animate-pulse absolute inset-0 bg-blue-500/20 rounded-full scale-150"></div>
        <div className="relative flex items-center justify-center mb-6">
          {/* <div className="animate-spin rounded-full w-6 h-6 p-2 border-b-2 border-blue-500 border-r-2 border-transparent"></div> */}
          <Wand2 size={24} className="absolute text-blue-400 animate-pulse" />
        </div>
      </div>
      <div className="text-neutral-400 text-sm text-center">Our AI is working its magic</div>
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  const SuccessStatus = () => (
    <div className="flex flex-col items-center mx-20 justify-center py-6 bg-green-900/20 rounded-lg border border-green-800/50 mb-4 animate-fade-in">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
        <CheckCircle size={48} className="relative text-green-400" />
      </div>
      <div className="text-green-400 text-lg font-medium mb-2">Success!</div>
    </div>
  );

  const ErrorStatus = () => (
    <div className="flex flex-col items-center mx-10 text-center justify-center py-6 bg-red-900/20 rounded-lg border border-red-800/50 mb-4 animate-fade-in">
      <AlertCircle size={48} className="text-red-400 mb-4" />
      <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
      <div className="text-neutral-400 text-sm">Please try again</div>
    </div>
  );

  // ============ MAIN RENDER ============
  return (
    <div className="max-h-full h-[calc(100vh-75px)] w-full flex !overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 flex transition-all duration-300">
        {/* History Toggle Button (always visible) */}
        <button
          onClick={() => setShowConversationSidebar(true)}
          className={`absolute left-0 top-0 z-10 bg-neutral-800 hover:bg-neutral-700 p-2 rounded-r-md border border-l-0 border-neutral-600 transition-all ${
            showConversationSidebar ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <History size={16} className="text-neutral-400" />
        </button>

        {/* Conversation History Sidebar */}
        <ConversationHistory
          conversations={conversations}
          activeConversationId={activeConversationId}
          showConversationSidebar={showConversationSidebar}
          onClose={() => setShowConversationSidebar(false)}
          onSelectConversation={loadConversation}
          onDeleteConversation={deleteConversation}
        />

        {activeTab === "preview" ? (
          <SplitPane
            split="vertical"
            minSize={isFullScreen ? 0 : 200}
            maxSize={isFullScreen ? 0 : 70}
            size={splitSize}
            defaultSize={35}
            onChange={handleSplitChange}
            className="!overflow-visible scrollbarwidth"
          >
            {/* Left - Code Prompt */}
            {!isFullScreen ? (
              <div className="flex flex-col relative w-full justify-end max-h-full h-[calc(100vh-76px)]">
                <div className="flex flex-col h-full">
                  {/* User Info & Token Usage - Fixed at top */}
                  <div className="p-4 pb-0">
                    <div className="mb-4 top-0 p-3 bg-neutral-800 rounded-sm border border-neutral-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 w-full">
                            <User size={14} className="text-blue-400" />
                            <span className="text-sm font-bold capitalize text-neutral-300">{user?.username || "Guest"}</span>
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
                  </div>

                  {/* Status Indicators */}
                  {generationStatus === "generating" && <GeneratingStatus />}
                  {generationStatus === "success" && <SuccessStatus />}
                  {generationStatus === "error" && <ErrorStatus />}

                  {/* Prompt History Display - Scrollable area */}
                  <div className="flex-1 overflow-y-auto scrollbarwidth px-4 mr-3">
                    {promptHistory.map((item, index) => (
                      <div key={index} className="mb-4">
                        {/* Prompt Display */}
                        <div className="border rounded-sm mb-2 border-neutral-700">
                          <div className="bg-neutral-900 w-full min-h-[60px] p-3 text-sm">
                            <div className="text-neutral-200 whitespace-pre-wrap">{item.prompt}</div>
                          </div>
                        </div>

                        {/* AI Response Display - ENHANCED UX */}
                        <div className="border rounded-sm mb-4 border-neutral-700">
                          <div className="bg-neutral-900 w-full min-h-[80px] p-3 text-sm">
                            {item.response.includes("🔄") ? (
                              <div className="flex items-center text-blue-400">
                                {!isGenerating && (
                                  <div className="text-neutral-200 whitespace-pre-wrap flex items-start">
                                    <CheckCircle size={26} className="mr-2 text-green-500" />
                                    Project generated successfully! Check the Code and Preview tabs.
                                  </div>
                                )}
                                {isGenerating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>}
                              </div>
                            ) : item.response.includes("❌") ? (
                              <div className="flex items-start text-red-400">
                                <div className="flex-shrink-0 mt-0.5">
                                  <AlertCircle size={16} className="mr-2" />
                                </div>
                                <div className="text-neutral-200 whitespace-pre-wrap">{item.response.replace("❌ ", "")}</div>
                              </div>
                            ) : item.response.includes("✅") ? (
                              <div className="flex items-start text-green-400">
                                <div className="flex-shrink-0 mt-0.5">
                                  <CheckCircle size={16} className="mr-2" />
                                </div>
                                <div className="text-neutral-200 whitespace-pre-wrap">{item.response.replace("✅ ", "")}</div>
                              </div>
                            ) : (
                              <div className="text-neutral-200 whitespace-pre-wrap">{item.response}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area - Fixed at bottom */}
                  <div className="p-4 pt-0">
                    <div className="w-full relative group flex flex-col border-neutral-600 border bg-neutral-900 rounded-sm ">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!canRequest || isGenerating || !isAuthenticated}
                        className="w-full pl-2 pt-1 scrollbarwidth text-sm overflow-y-scroll !border-none rounded-t-sm font-medium placeholder:text-neutral-500 h-[8rem] transition-all duration-200 bg-neutral-900 group disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                        placeholder={
                          !isAuthenticated
                            ? "Please login to use AI features"
                            : !canRequest
                            ? "Daily token limit exceeded"
                            : "Describe your landing page (e.g., 'Create a modern landing page for a tech startup')"
                        }
                      />
                      <div className="flex items-center border-none border-gray-700 p-2 justify-between flex-nowrap">
                        <div className="flex items-center gap-2">
                          <Link size={20} className="cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors" />
                          <SpitchSpeechToText
                            onTranscript={handleTranscript}
                            language="en"
                            autoTranslate={true}
                            isAuthenticated={isAuthenticated}
                            canRequest={canRequest}
                            isGenerating={isGenerating}
                          />
                        </div>
                        <div className="">
                          <Button
                            onClick={handleSendPrompt}
                            disabled={!prompt.trim() || !canRequest || isGenerating || !isAuthenticated}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-400 transition-all duration-200"
                          >
                            {isGenerating ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                <span className="text-xs">Generating...</span>
                              </div>
                            ) : (
                              <SendHorizonal size={16} />
                            )}
                          </Button>
                        </div>
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
    </div>
  );
}
