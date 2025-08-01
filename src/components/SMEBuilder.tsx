import React, { useState } from "react";
import {
   Wand2,
   Eye,
   Code,
   Smartphone,
   Monitor,
   Palette,
   Type,
   Image as ImageIcon,
   Save,
   Globe,
   Settings,
   ArrowLeft,
} from "lucide-react";
import { User } from "../App";

interface SMEBuilderProps {
   user: User | null;
   onSwitchView: (view: "ide" | "team" | "sme") => void;
}

const SMEBuilder: React.FC<SMEBuilderProps> = ({ onSwitchView }) => {
   const [currentView, setCurrentView] = useState<
      "builder" | "preview" | "code"
   >("builder");
   const [prompt, setPrompt] = useState("");
   const [isGenerating, setIsGenerating] = useState(false);
   const [siteData, setSiteData] = useState({
      title: "My African Business",
      description: "Welcome to our amazing business",
      primaryColor: "#6C33FF",
      sections: [
         {
            id: "1",
            type: "hero",
            title: "Welcome to My Business",
            subtitle: "We provide amazing services across Africa",
            buttonText: "Get Started",
            backgroundImage:
               "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
         },
         {
            id: "2",
            type: "features",
            title: "Our Services",
            items: [
               {
                  title: "Fast Delivery",
                  description: "Quick service across major African cities",
               },
               {
                  title: "Local Support",
                  description: "Customer support in your local language",
               },
               {
                  title: "Mobile Payments",
                  description: "Pay with M-Pesa, MTN MoMo, and more",
               },
            ],
         },
      ],
   });

   const handleGenerateFromPrompt = () => {
      if (!prompt.trim()) return;

      setIsGenerating(true);

      // Simulate AI generation
      setTimeout(() => {
         setSiteData((prev) => ({
            ...prev,
            title: "AI Generated Business Site",
            description: "Generated from your prompt",
            sections: [
               {
                  id: "1",
                  type: "hero",
                  title: "Your Business Vision",
                  subtitle: "Built with AI for African entrepreneurs",
                  buttonText: "Learn More",
                  backgroundImage:
                     "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
               },
               {
                  id: "2",
                  type: "features",
                  title: "Key Features",
                  items: [
                     {
                        title: "AI-Powered",
                        description: "Built with artificial intelligence",
                     },
                     {
                        title: "Mobile-First",
                        description: "Optimized for African mobile users",
                     },
                     {
                        title: "Local Integration",
                        description: "Supports local payment methods",
                     },
                  ],
               },
            ],
         }));
         setIsGenerating(false);
         setPrompt("");
      }, 3000);
   };

   const renderBuilder = () => (
      <div className="flex h-full">
         {/* Left Panel - Controls */}
         <div className="w-80 bg-white dark:bg-[#161B22] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
               {/* AI Prompt */}
               <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                     AI Website Builder
                  </h3>
                  <div className="space-y-3">
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your business website... e.g., 'Create a modern restaurant website with online ordering for Lagos, Nigeria'"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent resize-none"
                        rows={4}
                     />
                     <button
                        onClick={handleGenerateFromPrompt}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#6C33FF] to-[#00A676] hover:from-[#5A2BD8] hover:to-[#008A63] text-white py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Wand2 className="w-4 h-4" />
                        <span>
                           {isGenerating ? "Generating..." : "Generate with AI"}
                        </span>
                     </button>
                  </div>
               </div>

               {/* Site Settings */}
               <div className="space-y-6">
                  <div>
                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Site Settings
                     </h4>
                     <div className="space-y-3">
                        <div>
                           <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Site Title
                           </label>
                           <input
                              type="text"
                              value={siteData.title}
                              onChange={(e) =>
                                 setSiteData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                 }))
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Description
                           </label>
                           <input
                              type="text"
                              value={siteData.description}
                              onChange={(e) =>
                                 setSiteData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                 }))
                              }
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Primary Color
                           </label>
                           <div className="flex items-center space-x-2">
                              <input
                                 type="color"
                                 value={siteData.primaryColor}
                                 onChange={(e) =>
                                    setSiteData((prev) => ({
                                       ...prev,
                                       primaryColor: e.target.value,
                                    }))
                                 }
                                 className="w-10 h-8 rounded border border-gray-200 dark:border-gray-700"
                              />
                              <input
                                 type="text"
                                 value={siteData.primaryColor}
                                 onChange={(e) =>
                                    setSiteData((prev) => ({
                                       ...prev,
                                       primaryColor: e.target.value,
                                    }))
                                 }
                                 className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Design Tools */}
                  <div>
                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Design Tools
                     </h4>
                     <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-[#0D0D0D] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                           <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                           <span className="text-xs text-gray-700 dark:text-gray-300">
                              Fonts
                           </span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-[#0D0D0D] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                           <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                           <span className="text-xs text-gray-700 dark:text-gray-300">
                              Colors
                           </span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-[#0D0D0D] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                           <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                           <span className="text-xs text-gray-700 dark:text-gray-300">
                              Images
                           </span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-[#0D0D0D] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                           <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                           <span className="text-xs text-gray-700 dark:text-gray-300">
                              Layout
                           </span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Panel - Preview */}
         <div className="flex-1 bg-gray-100 dark:bg-[#0D0D0D] overflow-y-auto">
            <div className="p-6">
               <div className="bg-white dark:bg-[#161B22] rounded-xl shadow-lg overflow-hidden">
                  {/* Hero Section */}
                  <div
                     className="relative h-96 bg-cover bg-center flex items-center justify-center"
                     style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${siteData.sections[0]?.backgroundImage})`,
                        backgroundColor: siteData.primaryColor,
                     }}
                  >
                     <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">
                           {siteData.sections[0]?.title}
                        </h1>
                        <p className="text-xl mb-6">
                           {siteData.sections[0]?.subtitle}
                        </p>
                        <button
                           className="px-8 py-3 rounded-lg font-medium transition-colors"
                           style={{ backgroundColor: siteData.primaryColor }}
                        >
                           {siteData.sections[0]?.buttonText}
                        </button>
                     </div>
                  </div>

                  {/* Features Section */}
                  <div className="p-12">
                     <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        {siteData.sections[1]?.title}
                     </h2>
                     <div className="grid md:grid-cols-3 gap-8">
                        {siteData.sections[1]?.items?.map((item, index) => (
                           <div key={index} className="text-center">
                              <div
                                 className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                 style={{
                                    backgroundColor: `${siteData.primaryColor}20`,
                                 }}
                              >
                                 <div
                                    className="w-8 h-8 rounded-full"
                                    style={{
                                       backgroundColor: siteData.primaryColor,
                                    }}
                                 />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                 {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                 {item.description}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   const renderPreview = () => (
      <div className="h-full bg-gray-100 dark:bg-[#0D0D0D] overflow-y-auto">
         <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-[#161B22] rounded-xl shadow-lg overflow-hidden">
               {/* Full preview content */}
               <div
                  className="relative h-96 bg-cover bg-center flex items-center justify-center"
                  style={{
                     backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${siteData.sections[0]?.backgroundImage})`,
                     backgroundColor: siteData.primaryColor,
                  }}
               >
                  <div className="text-center text-white">
                     <h1 className="text-4xl font-bold mb-4">
                        {siteData.sections[0]?.title}
                     </h1>
                     <p className="text-xl mb-6">
                        {siteData.sections[0]?.subtitle}
                     </p>
                     <button
                        className="px-8 py-3 rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: siteData.primaryColor }}
                     >
                        {siteData.sections[0]?.buttonText}
                     </button>
                  </div>
               </div>

               <div className="p-12">
                  <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                     {siteData.sections[1]?.title}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                     {siteData.sections[1]?.items?.map((item, index) => (
                        <div key={index} className="text-center">
                           <div
                              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                              style={{
                                 backgroundColor: `${siteData.primaryColor}20`,
                              }}
                           >
                              <div
                                 className="w-8 h-8 rounded-full"
                                 style={{
                                    backgroundColor: siteData.primaryColor,
                                 }}
                              />
                           </div>
                           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {item.title}
                           </h3>
                           <p className="text-gray-600 dark:text-gray-400">
                              {item.description}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   const renderCode = () => (
      <div className="h-full bg-gray-900 text-gray-100 overflow-y-auto">
         <div className="p-6">
            <pre className="text-sm">
               <code>
                  {`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteData.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        .hero {
            height: 400px;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                        url('${siteData.sections[0]?.backgroundImage}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; }
        .hero button {
            background: ${siteData.primaryColor};
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
        }
        .features {
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .features h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 3rem;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        .feature {
            text-align: center;
        }
        .feature-icon {
            width: 4rem;
            height: 4rem;
            background: ${siteData.primaryColor}33;
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .feature-icon::before {
            content: '';
            width: 2rem;
            height: 2rem;
            background: ${siteData.primaryColor};
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>${siteData.sections[0]?.title}</h1>
            <p>${siteData.sections[0]?.subtitle}</p>
            <button>${siteData.sections[0]?.buttonText}</button>
        </div>
    </section>
    
    <section class="features">
        <h2>${siteData.sections[1]?.title}</h2>
        <div class="features-grid">
            ${siteData.sections[1]?.items
               ?.map(
                  (item) => `
            <div class="feature">
                <div class="feature-icon"></div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>`
               )
               .join("")}
        </div>
    </section>
</body>
</html>`}
               </code>
            </pre>
         </div>
      </div>
   );

   return (
      <div className="flex-1 bg-gray-50 dark:bg-[#0D0D0D] overflow-hidden">
         <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-[#161B22] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <button
                        onClick={() => onSwitchView("ide")}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                     >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to IDE</span>
                     </button>
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                           SME Website Builder
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                           Build your business website with AI
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <div className="flex items-center bg-gray-100 dark:bg-[#0D0D0D] rounded-lg p-1">
                        <button
                           onClick={() => setCurrentView("builder")}
                           className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentView === "builder"
                                 ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                                 : "text-gray-600 dark:text-gray-400"
                           }`}
                        >
                           <Wand2 className="w-4 h-4" />
                           <span>Builder</span>
                        </button>
                        <button
                           onClick={() => setCurrentView("preview")}
                           className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentView === "preview"
                                 ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                                 : "text-gray-600 dark:text-gray-400"
                           }`}
                        >
                           <Eye className="w-4 h-4" />
                           <span>Preview</span>
                        </button>
                        <button
                           onClick={() => setCurrentView("code")}
                           className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentView === "code"
                                 ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-white shadow-sm"
                                 : "text-gray-600 dark:text-gray-400"
                           }`}
                        >
                           <Code className="w-4 h-4" />
                           <span>Code</span>
                        </button>
                     </div>
                     <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                           <Smartphone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                           <Monitor className="w-5 h-5" />
                        </button>
                     </div>
                     <button className="flex items-center space-x-2 bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                     </button>
                     <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Globe className="w-4 h-4" />
                        <span>Publish</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
               {currentView === "builder" && renderBuilder()}
               {currentView === "preview" && renderPreview()}
               {currentView === "code" && renderCode()}
            </div>
         </div>
      </div>
   );
};

export default SMEBuilder;
