export interface CodeSuggestion {
  text: string;
  replacement?: string;
  severity?: "info" | "warning" | "error";
}

export interface CodeAnalysis {
  suggestions: CodeSuggestion[];
  explanation?: string;
}

export interface CodeGenerationResponse {
  code: string;
  language: string;
  explanation?: string;
}

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "https://devassit-api.onrender.com/api";
  }

  private getAuthToken(): string | null {
    // Use the same token storage as your DevAssistAPI
    return localStorage.getItem("accessToken");
  }

  private async request(endpoint: string, data: any) {
    try {
      const authToken = this.getAuthToken();

      if (!authToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("AI Service error:", error);
      throw error;
    }
  }

  async analyzeCode(code: string, context: string = ""): Promise<CodeAnalysis> {
    try {
      // Use the generateAIResponse method from your API
      const response = await this.request("/ai/generate", {
        prompt: `Analyze this code and provide suggestions:\n\n${code}\n\nProject Context: ${context}`,
        mode: "explain",
      });

      // Transform the API response to match our expected format
      return {
        suggestions: [
          {
            text: response.response || "Code analysis completed",
            severity: "info",
          },
        ],
        explanation: response.response || "I've analyzed your code. It looks good! Let me know if you need specific improvements.",
      };
    } catch (error) {
      console.error("Error analyzing code:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback to a simple analysis if the API is not available
      return {
        suggestions: [
          {
            text: "This is a demo suggestion. In a real implementation, this would provide specific code improvements.",
            severity: "info",
          },
        ],
        explanation: "This is a demo explanation. In a real implementation, this would provide detailed analysis of your code.",
      };
    }
  }

  async chat(message: string, context: string = ""): Promise<string> {
    try {
      const response = await this.request("/ai/generate", {
        prompt: message,
        mode: "explain",
        context,
      });

      return response.response || "I'm here to help with your code questions!";
    } catch (error) {
      console.error("Error in AI chat:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback response
      return "I'm having trouble connecting to the AI service. This is a demo response. In a real implementation, I would provide helpful answers to your questions about the code.";
    }
  }

  async explainCode(code: string, language: string = ""): Promise<string> {
    try {
      const response = await this.request("/ai/generate", {
        prompt: `Explain this ${language} code:\n\n${code}`,
        mode: "explain",
      });

      return response.response || `This ${language} code appears to be well-structured.`;
    } catch (error) {
      console.error("Error explaining code:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback explanation
      return `This is a demo explanation for ${language} code. In a real implementation, I would provide a detailed explanation of what this code does, how it works, and any important considerations.`;
    }
  }

  async generateCode(prompt: string, context: string = ""): Promise<CodeGenerationResponse> {
    try {
      const response = await this.request("/ai/generate", {
        prompt: prompt,
        mode: "generate",
        context,
      });

      return {
        code: response.response || "# Generated code will appear here",
        language: "auto",
        explanation: "Generated code based on your prompt",
      };
    } catch (error) {
      console.error("Error generating code:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback generated code
      return {
        code: `# This is demo generated code based on your prompt: "${prompt}"\n# In a real implementation, this would be actual code tailored to your request\n\ndef example_function():\n    print("Hello, this is generated code!")\n    return True`,
        language: "python",
        explanation: "This is demo generated code. In a real implementation, this would be actual code tailored to your request.",
      };
    }
  }

  async refactorCode(code: string, instructions: string, context: string = ""): Promise<{ code: string; explanation: string }> {
    try {
      const response = await this.request("/ai/generate", {
        prompt: `Refactor this code with these instructions: ${instructions}\n\nCode:\n${code}`,
        mode: "generate",
        context,
      });

      return {
        code: response.response || code,
        explanation: "Refactored code based on your instructions",
      };
    } catch (error) {
      console.error("Error refactoring code:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback refactored code
      return {
        code: `# This is demo refactored code based on your instructions: "${instructions}"\n# In a real implementation, this would be actual refactored code\n\n${code}`,
        explanation: "This is demo refactored code. In a real implementation, this would be actual code improvements based on your instructions.",
      };
    }
  }

  async debugCode(code: string, errorMessage: string = "", context: string = ""): Promise<{ solution: string; fixedCode: string }> {
    try {
      const prompt = errorMessage ? `Debug this code. Error: ${errorMessage}\n\nCode:\n${code}` : `Debug this code and find any issues:\n\n${code}`;

      const response = await this.request("/ai/generate", {
        prompt: prompt,
        mode: "explain",
        context,
      });

      return {
        solution: response.response || "Debugging analysis completed",
        fixedCode: code, // You might want a separate endpoint for fixed code
      };
    } catch (error) {
      console.error("Error debugging code:", error);

      // Check if it's an authentication error
      if (error.message.includes("Authentication required")) {
        throw error;
      }

      // Fallback debug response
      return {
        solution: "This is a demo debugging solution. In a real implementation, I would analyze your code and provide specific fixes for any issues.",
        fixedCode: code, // Return original code as fallback
      };
    }
  }

  // New method to check if user can make AI requests
  async canMakeAIRequest(): Promise<boolean> {
    try {
      const authToken = this.getAuthToken();

      const response = await fetch(`${this.baseURL}/ai/can-request`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.data.canRequest || false;
    } catch (error) {
      console.error("Error checking AI request capability:", error);
      return false;
    }
  }

  // New method to get token usage
  async getTokenUsage(): Promise<any> {
    try {
      const authToken = this.getAuthToken();

      const response = await fetch(`${this.baseURL}/ai/token-usage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error getting token usage:", error);
      return null;
    }
  }
}

// Create and export a singleton instance
export const aiService = new AIService();
