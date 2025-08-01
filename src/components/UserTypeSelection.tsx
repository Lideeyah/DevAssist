import React from "react";
import { X, Code, Users, Building, ArrowRight } from "lucide-react";
import { userType } from "../types";

interface UserTypeSelectionProps {
   onSelect: (userType: userType) => void;
   onClose: () => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({
   onSelect,
   onClose,
}) => {
   const userTypes = [
      {
         id: "individual" as const,
         title: "Individual Developer",
         description: "Perfect for solo developers and freelancers",
         icon: Code,
         features: [
            "AI-powered code assistance",
            "Modern IDE with VS Code features",
            "GitHub integration",
            "Terminal and debugging tools",
            "5 free AI uses per day",
         ],
         color: "from-blue-500 to-purple-600",
      },
      {
         id: "team" as const,
         title: "Team/Organization",
         description: "Built for development teams and organizations",
         icon: Users,
         features: [
            "Everything in Individual",
            "Team collaboration tools",
            "Shared AI tokens",
            "Live pair programming",
            "Team analytics and management",
         ],
         color: "from-green-500 to-teal-600",
         popular: true,
      },
      {
         id: "business" as const,
         title: "Business Owner",
         description: "No-code/low-code tools for non-developers",
         icon: Building,
         features: [
            "AI-powered website builder",
            "Drag-and-drop editor",
            "Hosting integration",
            "Mobile-responsive designs",
            "No coding required",
         ],
         color: "from-orange-500 to-red-600",
      },
   ];

   return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                     Choose Your Path
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Select the option that best describes how you'll use
                     DevAssist
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* User Type Cards */}
            <div className="p-6">
               <div className="grid md:grid-cols-3 gap-6">
                  {userTypes.map((type) => (
                     <div
                        key={type.id}
                        className={`relative bg-white dark:bg-[#0D0D0D] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-all hover:border-transparent hover:shadow-xl group ${
                           type.popular
                              ? "ring-2 ring-[#6C33FF] ring-opacity-50"
                              : ""
                        }`}
                        onClick={() => onSelect(type.id)}
                     >
                        {type.popular && (
                           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-4 py-1 rounded-full text-sm font-medium">
                                 Most Popular
                              </span>
                           </div>
                        )}

                        <div
                           className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                           <type.icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                           {type.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                           {type.description}
                        </p>

                        <ul className="space-y-2 mb-6">
                           {type.features.map((feature, index) => (
                              <li
                                 key={index}
                                 className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                              >
                                 <div className="w-1.5 h-1.5 bg-[#00A676] rounded-full mr-3 flex-shrink-0"></div>
                                 {feature}
                              </li>
                           ))}
                        </ul>

                        <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#6C33FF] to-[#00A676] hover:from-[#5A2BD8] hover:to-[#008A63] text-white py-3 px-4 rounded-xl font-medium transition-all group-hover:shadow-lg">
                           <span>Choose {type.title}</span>
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-[#0D0D0D] px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't worry, you can always change this later in your settings
               </p>
            </div>
         </div>
      </div>
   );
};

export default UserTypeSelection;
