import { useState } from "react";
import { FiTerminal, FiX, FiMinus, FiSquare } from "react-icons/fi";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>(["Welcome to Monaco IDE Terminal"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOutput([...output, `$ ${input}`]);
    // Add command processing logic here
    setInput("");
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FiTerminal className="text-green-500" />
          <span>Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-700 rounded">
            <FiMinus size={14} />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded">
            <FiSquare size={12} />
          </button>
          <button className="p-1 hover:bg-red-500 rounded">
            <FiX size={14} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2 font-mono text-sm">
        {output.map((line, i) => (
          <div key={i} className="mb-1">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-transparent outline-none"
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
}
