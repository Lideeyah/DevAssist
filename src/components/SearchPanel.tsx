import React, { useState } from "react";
import { Search, Replace, CaseSensitive, Regex, FileText } from "lucide-react";
import { FileItem } from "../App";

interface SearchPanelProps {
   files: FileItem[];
   openFile: (file: FileItem) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ files, openFile }) => {
   const [searchQuery, setSearchQuery] = useState("");
   const [replaceQuery, setReplaceQuery] = useState("");
   const [caseSensitive, setCaseSensitive] = useState(false);
   const [useRegex, setUseRegex] = useState(false);
   const [showReplace, setShowReplace] = useState(false);
   const [searchResults, setSearchResults] = useState<File[]>([]);

   const searchInFiles = () => {
      if (!searchQuery.trim()) {
         setSearchResults([]);
         return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = [];

      const searchInFile = (file: FileItem) => {
         if (file.type === "file" && file.content) {
            const lines = file.content.split("\n");
            lines.forEach((line, lineIndex) => {
               const searchTerm = caseSensitive
                  ? searchQuery
                  : searchQuery.toLowerCase();
               const searchLine = caseSensitive ? line : line.toLowerCase();

               if (useRegex) {
                  try {
                     const regex = new RegExp(
                        searchTerm,
                        caseSensitive ? "g" : "gi"
                     );
                     const matches = [...line.matchAll(regex)];
                     matches.forEach((match) => {
                        results.push({
                           file,
                           line: lineIndex + 1,
                           column: match.index! + 1,
                           text: line.trim(),
                           match: match[0],
                        });
                     });
                  } catch (e) {
                     // Invalid regex
                     console.log(e);
                     
                  }
               } else {
                  const index = searchLine.indexOf(searchTerm);
                  if (index !== -1) {
                     results.push({
                        file,
                        line: lineIndex + 1,
                        column: index + 1,
                        text: line.trim(),
                        match: searchQuery,
                     });
                  }
               }
            });
         }

         if (file.children) {
            file.children.forEach(searchInFile);
         }
      };

      files.forEach(searchInFile);
      setSearchResults(results);
   };

   React.useEffect(() => {
      const debounceTimer = setTimeout(searchInFiles, 300);
      return () => clearTimeout(debounceTimer);
   }, [searchQuery, caseSensitive, useRegex, files]);

   return (
      <div className="h-full flex flex-col">
         <div className="p-3 border-b border-gray-200 dark:border-[#30363D]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-3">
               Search
            </h3>

            <div className="space-y-2">
               <div className="relative">
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search"
                     className="w-full px-3 py-2 pr-10 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
               </div>

               {showReplace && (
                  <div className="relative">
                     <input
                        type="text"
                        value={replaceQuery}
                        onChange={(e) => setReplaceQuery(e.target.value)}
                        placeholder="Replace"
                        className="w-full px-3 py-2 pr-10 bg-gray-100 dark:bg-[#262C36] border border-gray-300 dark:border-[#30363D] rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <Replace className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
               )}

               <div className="flex items-center space-x-2">
                  <button
                     onClick={() => setCaseSensitive(!caseSensitive)}
                     className={`p-1.5 rounded ${
                        caseSensitive
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200 dark:bg-[#262C36] text-gray-600 dark:text-gray-400"
                     }`}
                     title="Match Case"
                  >
                     <CaseSensitive className="w-4 h-4" />
                  </button>
                  <button
                     onClick={() => setUseRegex(!useRegex)}
                     className={`p-1.5 rounded ${
                        useRegex
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200 dark:bg-[#262C36] text-gray-600 dark:text-gray-400"
                     }`}
                     title="Use Regular Expression"
                  >
                     <Regex className="w-4 h-4" />
                  </button>
                  <button
                     onClick={() => setShowReplace(!showReplace)}
                     className={`p-1.5 rounded ${
                        showReplace
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200 dark:bg-[#262C36] text-gray-600 dark:text-gray-400"
                     }`}
                     title="Toggle Replace"
                  >
                     <Replace className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3">
            {searchQuery && (
               <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {searchResults.length} results in{" "}
                     {new Set(searchResults.map((r) => r.path)).size} files
                  </p>
               </div>
            )}

            {searchResults.length > 0 && (
               <div className="space-y-4">
                  {Object.entries(
                     searchResults.reduce((acc, result) => {
                        const filePath = result.path;
                        if (!acc[filePath]) acc[filePath] = [];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        acc[filePath].push(result);
                        return acc;
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     }, {} as Record<string, any[]>)
                  ).map(([filePath, results]) => (
                     <div key={filePath} className="space-y-1">
                        <div
                           className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#262C36] p-1 rounded"
                           onClick={() => openFile(results[0].file)}
                        >
                           <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                           <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {results[0].file.name}
                           </span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">
                              {results.length}{" "}
                              {results.length === 1 ? "result" : "results"}
                           </span>
                        </div>

                        <div className="ml-6 space-y-1">
                           {results.map((result, index) => (
                              <div
                                 key={index}
                                 className="text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-[#262C36] p-1 rounded"
                                 onClick={() => openFile(result.file)}
                              >
                                 <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <span>
                                       {result.line}:{result.column}
                                    </span>
                                 </div>
                                 <div className="text-gray-800 dark:text-gray-200 font-mono">
                                    {result.text.replace(
                                       new RegExp(result.match, "gi"),
                                       `<mark class="bg-yellow-200 dark:bg-yellow-800">${result.match}</mark>`
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {searchQuery && searchResults.length === 0 && (
               <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     No results found for "{searchQuery}"
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default SearchPanel;
