import React, { useState } from "react";
import { X, Zap, Crown, TrendingUp } from "lucide-react";
import { User } from "../App";

interface UsageTrackerProps {
   user: User;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
   onUpgrade: () => void;
}

const UsageTracker: React.FC<UsageTrackerProps> = ({ user, onUpgrade }) => {
   const [showModal, setShowModal] = useState(false);

   const usagePercentage =
      (user.subscription.aiUsageCount / user.subscription.aiUsageLimit) * 100;
   const isNearLimit = usagePercentage >= 80;
   const isAtLimit =
      user.subscription.aiUsageCount >= user.subscription.aiUsageLimit;

   // Show modal when user hits limit
   React.useEffect(() => {
      if (isAtLimit && user.subscription.plan === "free") {
         setShowModal(true);
      }
   }, [isAtLimit, user.subscription.plan]);

   if (user.subscription.plan !== "free") {
      return null; // Don't show for paid users
   }

   return (
      <>
         {/* Usage Bar */}
         <div
            className={`fixed bottom-4 right-4 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg transition-all ${
               isNearLimit ? "border-orange-500 dark:border-orange-400" : ""
            }`}
         >
            <div className="flex items-center space-x-3">
               <Zap
                  className={`w-5 h-5 ${
                     isNearLimit ? "text-orange-500" : "text-[#6C33FF]"
                  }`}
               />
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI Usage Today
                     </span>
                     <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.subscription.aiUsageCount}/
                        {user.subscription.aiUsageLimit}
                     </span>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                     <div
                        className={`h-full transition-all ${
                           isAtLimit
                              ? "bg-red-500"
                              : isNearLimit
                              ? "bg-orange-500"
                              : "bg-[#6C33FF]"
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                     />
                  </div>
               </div>
               {isNearLimit && (
                  <button
                     onClick={onUpgrade}
                     className="text-xs bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-3 py-1 rounded-full hover:shadow-lg transition-all"
                  >
                     Upgrade
                  </button>
               )}
            </div>
         </div>

         {/* Limit Reached Modal */}
         {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
               <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-md w-full">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white rounded-t-2xl">
                     <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                     >
                        <X className="w-5 h-5" />
                     </button>

                     <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                           <Zap className="w-6 h-6" />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold">
                              AI Limit Reached
                           </h2>
                           <p className="text-white/80 text-sm">
                              You've used all 5 free AI interactions today
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#6C33FF] to-[#00A676] rounded-full flex items-center justify-center mx-auto mb-4">
                           <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           Upgrade to Continue
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                           Get unlimited AI assistance and unlock premium
                           features
                        </p>
                     </div>

                     <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                           <TrendingUp className="w-4 h-4 text-[#00A676]" />
                           <span>Unlimited AI interactions</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                           <TrendingUp className="w-4 h-4 text-[#00A676]" />
                           <span>Advanced code analysis</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                           <TrendingUp className="w-4 h-4 text-[#00A676]" />
                           <span>Priority support</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <button
                           onClick={() => {
                              setShowModal(false);
                              onUpgrade();
                           }}
                           className="w-full bg-gradient-to-r from-[#6C33FF] to-[#00A676] hover:from-[#5A2BD8] hover:to-[#008A63] text-white py-3 px-4 rounded-xl font-medium transition-all"
                        >
                           Upgrade Now
                        </button>
                        <button
                           onClick={() => setShowModal(false)}
                           className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-xl font-medium transition-all"
                        >
                           Continue Without AI
                        </button>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 dark:bg-[#0D0D0D] px-6 py-4 text-center rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your limit resets tomorrow. Upgrade for unlimited
                        access.
                     </p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default UsageTracker;
