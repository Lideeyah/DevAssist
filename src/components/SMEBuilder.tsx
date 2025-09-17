"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Code, Layout, Upload } from "lucide-react";

interface SiteData {
  title: string;
  description: string;
  sections: Array<{ id: string; type: string; title: string; subtitle?: string; buttonText?: string; backgroundImage?: string }>;
}

export default function SMEBuilder() {
  const [siteData, setSiteData] = useState<SiteData>({
    title: "My SME Site",
    description: "A site built with AI",
    sections: [],
  });

  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/sme/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: "My SME Site",
          stack: "react",
          pages: [{ name: "home", content: prompt }],
          language: "en",
        }),
      });

      const data = await response.json();
      console.log("SME backend response:", data);

      if (data.success && data.data) {
        const parsed = typeof data.data === "string" ? JSON.parse(data.data) : data.data;

        setGeneratedFiles(parsed.files || {});
        setSiteData((prev) => ({
          ...prev,
          title: parsed.files?.["index.html"] ? "Generated SME Site" : prev.title,
          description: "Generated from AI",
          sections: [
            {
              id: "1",
              type: "hero",
              title: "Generated Homepage",
              subtitle: "SME Builder Output",
              buttonText: "Explore",
              backgroundImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
            },
          ],
        }));
      }
    } catch (error) {
      console.error("SME generation failed:", error);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  const renderCode = () => {
    if (Object.keys(generatedFiles).length === 0) {
      return <pre className="p-4 bg-gray-900 text-green-400 rounded-lg">No generated files yet...</pre>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(generatedFiles).map(([filename, content]) => (
          <Card key={filename} className="bg-gray-900 text-green-400">
            <CardContent className="p-4">
              <h3 className="text-yellow-400 font-bold">{filename}</h3>
              <pre className="overflow-x-auto whitespace-pre-wrap">{content}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Prompt Input */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layout className="w-6 h-6" /> SME Builder
          </h2>
          <Input
            placeholder="Describe your business website..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <Button onClick={handleGenerateFromPrompt} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : <Upload className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate Site"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{siteData.title}</h2>
          <p>{siteData.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderCode()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
