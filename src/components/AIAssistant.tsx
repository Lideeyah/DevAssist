import React, { useState } from "react";
import {
   X,
   Send,
   Sparkles,
   User as UserIcon,
   Bot,
   Code,
   Bug,
   BookOpen,
   Lightbulb,
   MessageCircle,
   Minimize2,
} from "lucide-react";
import { User } from "../App";

interface AIAssistantProps {
   user: User;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
   onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
   user,
   setUser,
   onClose,
}) => {
   const [activeMode, setActiveMode] = useState("chat");
   const [message, setMessage] = useState("");
   const [isMinimized, setIsMinimized] = useState(false);
   const [messages, setMessages] = useState([
      {
         type: "ai",
         content:
            "Hello! I'm your DevAssist AI companion. I'm here to help you code, debug, and learn. As an AI built for African developers, I understand the unique challenges you face and I'm here to support your journey. How can I assist you today?",
         timestamp: new Date().toLocaleTimeString(),
      },
   ]);

   const modes = [
      { id: "chat", icon: MessageCircle, label: "Chat" },
      { id: "code", icon: Code, label: "Code Review" },
      { id: "debug", icon: Bug, label: "Debug" },
      { id: "mentor", icon: BookOpen, label: "Mentor" },
      { id: "ideas", icon: Lightbulb, label: "Ideas" },
   ];

   const quickActions = [
      "Explain this code",
      "Find bugs in my code",
      "Optimize performance",
      "Add error handling",
      "Write unit tests",
      "Refactor this function",
   ];

   const handleSendMessage = () => {
      if (!message.trim()) return;

      // Check AI usage limit
      if (
         user &&
         user.subscription.aiUsageCount >= user.subscription.aiUsageLimit &&
         user.subscription.plan === "free"
      ) {
         alert(
            "You have reached your daily AI usage limit. Please upgrade to continue."
         );
         return;
      }

      const newMessage = {
         type: "user",
         content: message,
         timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Increment AI usage count
      if (user && setUser) {
         setUser((prev) =>
            prev
               ? {
                    ...prev,
                    subscription: {
                       ...prev.subscription,
                       aiUsageCount: prev.subscription.aiUsageCount + 1,
                    },
                 }
               : null
         );
      }

      // Simulate AI response
      setTimeout(() => {
         const aiResponse = {
            type: "ai",
            content: `I understand you want help with "${message}". Let me analyze this for you...

Based on your request, here are some suggestions:

1. **Code Structure**: Consider organizing your components into smaller, reusable pieces
2. **Performance**: Look into memoization for expensive calculations
3. **African Context**: Remember to consider mobile-first design for better accessibility across Africa

Would you like me to provide specific code examples or dive deeper into any of these areas?`,
            timestamp: new Date().toLocaleTimeString(),
         };
         setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
   };

   if (isMinimized) {
      return (
         <div className="fixed bottom-4 right-4 z-50">
            <button
               onClick={() => setIsMinimized(false)}
               className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
               <Sparkles className="w-6 h-6 text-white" />
            </button>
         </div>
      );
   }

   return (
      <div className="w-96 bg-white dark:bg-[#161B22] border-l border-gray-200 dark:border-[#30363D] flex flex-col h-full">
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#30363D]">
            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
               </div>
               <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                     AI Assistant
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                     Always here to help
                  </p>
                  {user && (
                     <p className="text-xs text-gray-500 dark:text-gray-500">
                        {user.subscription.aiUsageCount}/
                        {user.subscription.aiUsageLimit} uses today
                     </p>
                  )}
               </div>
            </div>
            <div className="flex items-center space-x-1">
               <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
               >
                  <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
               <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#262C36] transition-colors"
               >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               </button>
            </div>
         </div>

         {/* Mode Selector */}
         <div className="flex p-2 bg-gray-50 dark:bg-[#0D1117] border-b border-gray-200 dark:border-[#30363D] overflow-x-auto">
            {modes.map((mode) => (
               <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                     activeMode === mode.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#262C36]"
                  }`}
               >
                  <mode.icon className="w-3 h-3" />
                  <span>{mode.label}</span>
               </button>
            ))}
         </div>

         {/* Quick Actions */}
         <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
               Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
               {quickActions.slice(0, 3).map((action, index) => (
                  <button
                     key={index}
                     onClick={() => setMessage(action)}
                     className="px-2 py-1 bg-gray-100 dark:bg-[#262C36] hover:bg-gray-200 dark:hover:bg-[#30363D] text-gray-700 dark:text-gray-300 rounded text-xs transition-colors"
                  >
                     {action}
                  </button>
               ))}
            </div>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
               <div
                  key={index}
                  className={`flex ${
                     msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
               >
                  <div
                     className={`flex items-start space-x-2 max-w-[80%] ${
                        msg.type === "user"
                           ? "flex-row-reverse space-x-reverse"
                           : ""
                     }`}
                  >
                     <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                           msg.type === "user"
                              ? "bg-blue-600"
                              : "bg-gradient-to-br from-blue-600 to-purple-600"
                        }`}
                     >
                        {msg.type === "user" ? (
                           <UserIcon className="w-3 h-3 text-white" />
                        ) : (
                           <Bot className="w-3 h-3 text-white" />
                        )}
                     </div>
                     <div
                        className={`p-3 rounded-lg ${
                           msg.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-[#262C36] text-gray-800 dark:text-gray-200"
                        }`}
                     >
                        <p className="text-sm whitespace-pre-line">
                           {msg.content}
                        </p>
                        <p
                           className={`text-xs mt-1 ${
                              msg.type === "user"
                                 ? "text-blue-100"
                                 : "text-gray-500 dark:text-gray-400"
                           }`}
                        >
                           {msg.timestamp}
                        </p>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Message Input */}
         <div className="p-4 border-t border-gray-200 dark:border-[#30363D]">
            <div className="flex space-x-2">
               <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about your code..."
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <button
                  onClick={handleSendMessage}
                  disabled={
                     !message.trim() ||
                     (user.subscription.aiUsageCount >=
                        user.subscription.aiUsageLimit &&
                        user.subscription.plan === "free")
                  }
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
               >
                  <Send className="w-4 h-4" />
               </button>
            </div>

            {user &&
               user.subscription.aiUsageCount >=
                  user.subscription.aiUsageLimit &&
               user.subscription.plan === "free" && (
                  <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-200 dark:border-orange-800">
                     <p className="text-xs text-orange-700 dark:text-orange-300 text-center">
                        Daily AI limit reached. Upgrade for unlimited access.
                     </p>
                  </div>
               )}
         </div>
      </div>
   );
};

export default AIAssistant;
