import React, { useState } from "react";
import { Package, Download, Star, Search, Zap } from "lucide-react";

const ExtensionsPanel: React.FC = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [filter, setFilter] = useState("all");

   const extensions = [
      {
         id: 1,
         name: "African Code Snippets",
         description:
            "Code snippets optimized for African development contexts",
         author: "DevAssist Team",
         downloads: "50K+",
         rating: 4.8,
         installed: true,
         category: "snippets",
      },
      {
         id: 2,
         name: "Paystack Integration",
         description: "Easy integration with Paystack payment gateway",
         author: "Paystack",
         downloads: "25K+",
         rating: 4.9,
         installed: false,
         category: "payments",
      },
      {
         id: 3,
         name: "M-Pesa API Helper",
         description: "Simplified M-Pesa API integration for mobile payments",
         author: "Safaricom",
         downloads: "15K+",
         rating: 4.7,
         installed: false,
         category: "payments",
      },
      {
         id: 4,
         name: "African Languages Pack",
         description:
            "Support for Swahili, Yoruba, and other African languages",
         author: "Community",
         downloads: "8K+",
         rating: 4.6,
         installed: true,
         category: "languages",
      },
      {
         id: 5,
         name: "Low Bandwidth Optimizer",
         description: "Optimize your code for low bandwidth environments",
         author: "DevAssist Team",
         downloads: "12K+",
         rating: 4.5,
         installed: false,
         category: "optimization",
      },
   ];

   const filteredExtensions = extensions.filter((ext) => {
      const matchesSearch =
         ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         ext.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
         filter === "all" ||
         (filter === "installed" && ext.installed) ||
         (filter === "not-installed" && !ext.installed) ||
         ext.category === filter;
      return matchesSearch && matchesFilter;
   });

   return (
      <div className="h-full flex flex-col">
         <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-3">
               Extensions
            </h3>

            <div className="space-y-2">
               <div className="relative">
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search extensions..."
                     className="w-full px-3 py-2 pr-10 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
               </div>

               <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  <option value="all">All Extensions</option>
                  <option value="installed">Installed</option>
                  <option value="not-installed">Not Installed</option>
                  <option value="snippets">Snippets</option>
                  <option value="payments">Payments</option>
                  <option value="languages">Languages</option>
                  <option value="optimization">Optimization</option>
               </select>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
               {filteredExtensions.map((extension) => (
                  <div
                     key={extension.id}
                     className="p-3 border border-gray-200 dark:border-[#30363D] rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                     <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                           <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                           <h4 className="font-medium text-gray-800 dark:text-gray-200">
                              {extension.name}
                           </h4>
                        </div>
                        {extension.installed ? (
                           <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                              Installed
                           </span>
                        ) : (
                           <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                              <Download className="w-3 h-3" />
                              <span>Install</span>
                           </button>
                        )}
                     </div>

                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {extension.description}
                     </p>

                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-3">
                           <span>by {extension.author}</span>
                           <span>{extension.downloads} downloads</span>
                        </div>
                        <div className="flex items-center space-x-1">
                           <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                           <span>{extension.rating}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {filteredExtensions.length === 0 && (
               <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     No extensions found
                  </p>
               </div>
            )}
         </div>

         {/* Featured Extensions */}
         <div className="border-t border-gray-200 dark:border-[#30363D] p-3">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
               <Zap className="w-4 h-4 text-yellow-500" />
               <span>Featured for Africa</span>
            </h4>

            <div className="space-y-2">
               <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-1">
                     <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                     <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Africa Dev Toolkit
                     </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                     Essential tools for African developers
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ExtensionsPanel;
