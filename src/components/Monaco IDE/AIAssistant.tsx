import { useState, useRef, useEffect } from "react";
import { BsRobot } from "react-icons/bs";
import { SendHorizonal, Lightbulb, Wand2 } from "lucide-react";

interface AIAssistantProps {
  isAuthenticated: boolean;
  isAiAnalyzing: boolean;
  aiSuggestions: any[];
  conversation: any[];
  isAiResponding: boolean;
  activeFile: any;
  onSendMessage: (message: string) => void;
  onApplySuggestion: (suggestion: any) => void;
  onExplainCode: () => void;
  onGenerateCode: (prompt: string) => void;
  onReplaceContent: (newContent: string) => void;
}

export default function AIAssistant({
  isAuthenticated,
  isAiAnalyzing,
  aiSuggestions,
  conversation,
  isAiResponding,
  activeFile,
  onSendMessage,
  onApplySuggestion,
  onExplainCode,
  onGenerateCode,
  onReplaceContent,
}: AIAssistantProps) {
  const [userMessage, setUserMessage] = useState("");
  const [showGenerateInput, setShowGenerateInput] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const conversationEndRef = useRef(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = () => {
    if (!userMessage.trim() || !isAuthenticated) return;
    onSendMessage(userMessage);
    setUserMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExplainClick = () => {
    if (activeFile && isAuthenticated) {
      onExplainCode();
    } else if (!isAuthenticated) {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please log in to use the explain feature.",
        },
      ]);
    }
  };

  const handleGenerateClick = () => {
    if (!isAuthenticated) {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please log in to use the generate feature.",
        },
      ]);
      return;
    }

    if (showGenerateInput) {
      // If input is already showing, hide it
      setShowGenerateInput(false);
    } else {
      // Show the input field
      setShowGenerateInput(true);
    }
  };

  const handleGenerateSubmit = () => {
    if (generatePrompt.trim() && isAuthenticated) {
      onGenerateCode(generatePrompt);
      setGeneratePrompt("");
      setShowGenerateInput(false);
    }
  };

  const handleGenerateKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateSubmit();
    }
  };

  return (
    <div className="w-96 bg-gray-850 flex flex-col border-l border-white text-sm">
      <div className="flex h-8 border-b border-white px-2 items-center gap-3">
        <BsRobot size={14} className="text-chart-2" />
        <h3 className="font-semibold">AI Assistant</h3>

        {isAiAnalyzing && (
          <div className="flex items-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-1 h-1 bg-chart-2 rounded-full"></div>
              <div className="w-1 h-1 bg-chart-2 rounded-full animation-delay-200"></div>
              <div className="w-1 h-1 bg-chart-2 rounded-full animation-delay-400"></div>
            </div>
            <span className="text-xs ml-1 text-chart-2">Analyzing</span>
          </div>
        )}
      </div>

      {/* Generate input field */}
      {showGenerateInput && (
        <div className="p-3 border-b border-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="What would you like to generate?"
              className="w-full border h-8 border-white px-2 py-1 rounded text-sm focus:outline-none focus:border-chart-2"
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              onKeyPress={handleGenerateKeyPress}
              autoFocus
            />
            <button
              className="bg-chart-2 h-7 w-7 flex items-center justify-center cursor-pointer hover:bg-chart-2 rounded"
              onClick={handleGenerateSubmit}
            >
              <SendHorizonal size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-3 space-y-3 overflow-y-auto">
        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="p-3 rounded-lg border border-yellow-700 bg-yellow-900/20 mb-4">
            <p className="text-sm">Please log in to use AI features. Click "Login" in the File menu.</p>
          </div>
        )}

        {/* AI Suggestions */}
        {isAuthenticated && aiSuggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">SUGGESTIONS</h4>
            {aiSuggestions.map((suggestion: any, index: number) => (
              <div key={index} className="p-2 rounded-lg border border-white bg-secondary mb-2">
                <p className="text-sm mb-2">{suggestion.text}</p>
                {suggestion.replacement && (
                  <div className="flex gap-2">
                    <button className="px-2 py-1 text-xs bg-blue-600 hover:bg-white rounded" onClick={() => onApplySuggestion(suggestion)}>
                      Apply
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-green-600 hover:bg-white rounded"
                      onClick={() => onReplaceContent(suggestion.replacement)}
                    >
                      Replace All
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Conversation */}
        {conversation.map((message: any, index: number) => (
          <div key={index} className={`p-3 rounded-lg ${message.role === "user" ? "bg-secondary border border-white ml-8" : "border border-white"}`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="p-2 px-4 bg-foreground font-semibold text-secondary cursor-pointer transition-all duration-200 rounded-sm hover:scale-95 disabled:opacity-50"
            onClick={handleExplainClick}
            disabled={!activeFile || !isAuthenticated || isAiResponding}
            title="Explain current code"
          >
            Explain
          </button>
          <button
            className="p-2 px-4 bg-green-200 font-semibold text-green-600 cursor-pointer transition-all duration-200 rounded-sm hover:scale-95 disabled:opacity-50"
            onClick={handleGenerateClick}
            disabled={!isAuthenticated || isAiResponding}
            title="Generate code"
          >
            Generate code
          </button>
        </div>

        {isAiResponding && (
          <div className="p-3 rounded-lg bg-secondary border border-white">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <div className="w-2 h-2 bg-chart-2 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-chart-2 rounded-full animation-delay-400"></div>
              </div>
              <span className="text-xs text-chart-2">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <div className="p-3 border-t border-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={isAuthenticated ? "Ask AI anything..." : "Please log in to use AI features"}
            className="w-full border h-10 border-white px-2 py-1 rounded-lg text-sm focus:outline-none focus:border-chart-2"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isAiResponding || !isAuthenticated}
          />
          <button
            className="bg-chart-2 h-9 w-10 flex items-center justify-center cursor-pointer hover:bg-chart-2 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={isAiResponding || !userMessage.trim() || !isAuthenticated}
          >
            <SendHorizonal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
