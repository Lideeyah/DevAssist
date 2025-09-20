import { History, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export interface Conversation {
  id: string;
  prompt: string;
  timestamp: Date;
  project: {
    files: File[];
    mainFile: string;
  };
  promptHistory: PromptHistory[];
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  showConversationSidebar: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

export default function ConversationHistory({
  conversations,
  activeConversationId,
  showConversationSidebar,
  onClose,
  onSelectConversation,
  onDeleteConversation,
}: ConversationHistoryProps) {
  return (
    <div
      className={`absolute top-0 left-0 z-20 w-[90%] max-h-full h-[calc(100vh-92px)] bg-neutral-800 border-r border-neutral-700 p-4 overflow-y-auto scrollbarwidth transition-all duration-300 ${
        showConversationSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
          <History size={16} />
          History
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-neutral-400 hover:text-white">
          <X size={14} />
        </Button>
      </div>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 mr-3 rounded border cursor-pointer transition-colors ${
              activeConversationId === conversation.id
                ? "bg-blue-900/30 border-blue-500"
                : "bg-neutral-700/50 border-neutral-600 hover:bg-neutral-600"
            }`}
            onClick={() => {
              onSelectConversation(conversation.id);
              onClose();
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-neutral-400">{new Date(conversation.timestamp).toLocaleTimeString()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                className="text-neutral-400 hover:text-red-400 text-xs transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-white line-clamp-2">{conversation.prompt}</p>
          </div>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="text-center text-neutral-500 text-sm py-4">No conversations yet. Enter a prompt to get started!</div>
      )}
    </div>
  );
}
