import React, { useState } from "react";
import {
   Play,
   Square,
   RotateCcw,
   Bug,
   AlertCircle,
   CheckCircle,
   XCircle,
} from "lucide-react";

const DebugPanel: React.FC = () => {
   const [isDebugging, setIsDebugging] = useState(false);
   const [breakpoints] = useState([
      { file: "src/App.tsx", line: 25, condition: "" },
      {
         file: "src/utils/api.ts",
         line: 42,
         condition: "response.status === 404",
      },
   ]);

   const [debugOutput] = useState([
      { type: "info", message: "Debug session started", timestamp: "10:30:15" },
      {
         type: "warning",
         message: 'Variable "user" might be undefined',
         timestamp: "10:30:18",
      },
      {
         type: "error",
         message: 'TypeError: Cannot read property "name" of undefined',
         timestamp: "10:30:20",
      },
      {
         type: "success",
         message: "Breakpoint hit at line 25",
         timestamp: "10:30:22",
      },
   ]);

   const getLogIcon = (type: string) => {
      switch (type) {
         case "error":
            return <XCircle className="w-4 h-4 text-red-500" />;
         case "warning":
            return <AlertCircle className="w-4 h-4 text-yellow-500" />;
         case "success":
            return <CheckCircle className="w-4 h-4 text-green-500" />;
         default:
            return <AlertCircle className="w-4 h-4 text-blue-500" />;
      }
   };

   return (
      <div className="h-full flex flex-col">
         <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-3">
               Debug Console
            </h3>

            <div className="flex items-center space-x-2">
               <button
                  onClick={() => setIsDebugging(!isDebugging)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                     isDebugging
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
               >
                  {isDebugging ? (
                     <>
                        <Square className="w-4 h-4" />
                        <span>Stop</span>
                     </>
                  ) : (
                     <>
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                     </>
                  )}
               </button>

               <button className="p-2 border border-gray-300 dark:border-[#30363D] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded-md transition-colors">
                  <RotateCcw className="w-4 h-4" />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {/* Breakpoints Section */}
            <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
               <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
                  <Bug className="w-4 h-4" />
                  <span>Breakpoints ({breakpoints.length})</span>
               </h4>

               <div className="space-y-2">
                  {breakpoints.map((bp, index) => (
                     <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-[#262C36] rounded"
                     >
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                           <div className="text-sm text-gray-800 dark:text-gray-200">
                              {bp.file}:{bp.line}
                           </div>
                           {bp.condition && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                 {bp.condition}
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Debug Output */}
            <div className="p-3">
               <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Debug Output
               </h4>

               <div className="space-y-2 font-mono text-sm">
                  {debugOutput.map((log, index) => (
                     <div
                        key={index}
                        className="flex items-start space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded"
                     >
                        {getLogIcon(log.type)}
                        <div className="flex-1">
                           <div className="text-gray-800 dark:text-gray-200">
                              {log.message}
                           </div>
                           <div className="text-xs text-gray-500 dark:text-gray-400">
                              {log.timestamp}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Variables Section */}
            <div className="p-3 border-t border-gray-200 dark:border-[#30363D]">
               <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Variables
               </h4>

               <div className="space-y-2 font-mono text-sm">
                  {[
                     {
                        name: "user",
                        value: '{ name: "John", age: 30 }',
                        type: "object",
                     },
                     { name: "isLoading", value: "false", type: "boolean" },
                     { name: "count", value: "42", type: "number" },
                     {
                        name: "message",
                        value: '"Hello World"',
                        type: "string",
                     },
                  ].map((variable, index) => (
                     <div
                        key={index}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded"
                     >
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                           {variable.name}:
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                           {variable.value}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                           ({variable.type})
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default DebugPanel;
