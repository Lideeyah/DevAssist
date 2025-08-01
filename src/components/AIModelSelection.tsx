import React, { useState } from "react";
import { X, Brain, Zap, Star, Check } from "lucide-react";

interface AIModelSelectionProps {
   onSelect: (model: string) => void;
   onClose: () => void;
}

const AIModelSelection: React.FC<AIModelSelectionProps> = ({
   onSelect,
   onClose,
}) => {
   const [selectedModel, setSelectedModel] = useState("gpt-4");

   const models = [
      {
         id: "gpt-4",
         name: "GPT-4",
         provider: "OpenAI",
         description: "Most capable model for complex coding tasks",
         features: [
            "Advanced code generation",
            "Complex problem solving",
            "Multi-language support",
            "Best for production code",
         ],
         speed: "Medium",
         quality: "Excellent",
         popular: true,
         color: "from-green-500 to-emerald-600",
      },
      {
         id: "claude-3",
         name: "Claude 3",
         provider: "Anthropic",
         description: "Great for code analysis and explanations",
         features: [
            "Excellent code understanding",
            "Detailed explanations",
            "Safe and helpful",
            "Great for learning",
         ],
         speed: "Fast",
         quality: "Excellent",
         color: "from-blue-500 to-cyan-600",
      },
      {
         id: "codellama",
         name: "Code Llama",
         provider: "Meta",
         description: "Specialized for code generation and completion",
         features: [
            "Fast code completion",
            "Optimized for coding",
            "Good performance",
            "Open source",
         ],
         speed: "Very Fast",
         quality: "Good",
         color: "from-purple-500 to-pink-600",
      },
      {
         id: "gemini-pro",
         name: "Gemini Pro",
         provider: "Google",
         description: "Balanced performance for various coding tasks",
         features: [
            "Multimodal capabilities",
            "Good reasoning",
            "Fast responses",
            "Reliable performance",
         ],
         speed: "Fast",
         quality: "Very Good",
         color: "from-orange-500 to-red-600",
      },
   ];

   const handleSelect = () => {
      onSelect(selectedModel);
   };

   return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#6C33FF] to-[#00A676] rounded-xl flex items-center justify-center">
                     <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Choose Your AI Model
                     </h2>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Select the AI model that best fits your coding style
                     </p>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* Models Grid */}
            <div className="p-6">
               <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {models.map((model) => (
                     <div
                        key={model.id}
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                           selectedModel === model.id
                              ? "border-[#6C33FF] bg-[#6C33FF]/5"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#6C33FF]/50"
                        }`}
                        onClick={() => setSelectedModel(model.id)}
                     >
                        {model.popular && (
                           <div className="absolute -top-3 left-4">
                              <span className="bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                 <Star className="w-3 h-3" />
                                 <span>Popular</span>
                              </span>
                           </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                           <div
                              className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center`}
                           >
                              <Brain className="w-6 h-6 text-white" />
                           </div>
                           {selectedModel === model.id && (
                              <div className="w-6 h-6 bg-[#6C33FF] rounded-full flex items-center justify-center">
                                 <Check className="w-4 h-4 text-white" />
                              </div>
                           )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                           {model.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                           by {model.provider}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                           {model.description}
                        </p>

                        <div className="space-y-2 mb-4">
                           {model.features.map((feature, index) => (
                              <div
                                 key={index}
                                 className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                              >
                                 <div className="w-1.5 h-1.5 bg-[#00A676] rounded-full mr-3 flex-shrink-0"></div>
                                 {feature}
                              </div>
                           ))}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center space-x-4">
                              <div>
                                 <span className="text-gray-500 dark:text-gray-400">
                                    Speed:
                                 </span>
                                 <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                                    {model.speed}
                                 </span>
                              </div>
                              <div>
                                 <span className="text-gray-500 dark:text-gray-400">
                                    Quality:
                                 </span>
                                 <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                                    {model.quality}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Info Box */}
               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                     <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                     <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                           Free Tier Includes
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                           5 AI interactions per day with your chosen model. You
                           can switch models anytime in settings.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Continue Button */}
               <button
                  onClick={handleSelect}
                  className="w-full bg-gradient-to-r from-[#6C33FF] to-[#00A676] hover:from-[#5A2BD8] hover:to-[#008A63] text-white py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
               >
                  <span>
                     Continue with{" "}
                     {models.find((m) => m.id === selectedModel)?.name}
                  </span>
                  <Check className="w-5 h-5" />
               </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-[#0D0D0D] px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can change your AI model preference anytime in settings
               </p>
            </div>
         </div>
      </div>
   );
};

export default AIModelSelection;
