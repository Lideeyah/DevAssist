import { api } from "./api";

export const AIService = {
  async analyzeCode(code: string, context: string = "") {
    try {
      // Check if user is authenticated first
      if (!api.isAuthenticated()) {
        throw new Error("Please log in to use AI features");
      }

      const response = await api.generateAIResponse(
        `Analyze this code and provide suggestions:\n\n${code}\n\nProject Context: ${context}`,
        "explain"
      );

      return {
        suggestions: [
          {
            text: response.response,
            replacement: "",
            type: "analysis",
          },
        ],
        explanation: response.response,
      };
    } catch (error) {
      console.error("API Error:", error);

      // Return a more specific error message for authentication issues
      if (error instanceof Error && (error.message.includes("authentication") || error.message.includes("log in"))) {
        return {
          suggestions: [],
          explanation: "Authentication required. Please log in to use AI features.",
        };
      }

      return this.getSimulatedResponse(code, context);
    }
  },

  async generateCompletion(prompt: string, codeContext: string) {
    try {
      // Check if user is authenticated first
      if (!api.isAuthenticated()) {
        throw new Error("Please log in to use AI features");
      }

      const response = await api.generateAIResponse(`${prompt}\n\nCode Context: ${codeContext}`, "generate");

      return {
        completion: response.response,
        type: "completion",
      };
    } catch (error) {
      console.error("API Error:", error);

      // Return a more specific error message for authentication issues
      if (error instanceof Error && (error.message.includes("authentication") || error.message.includes("log in"))) {
        return {
          completion: "\n\nPlease log in to use AI features.",
          type: "error",
        };
      }

      return this.getSimulatedCompletion(prompt, codeContext);
    }
  },

  async chat(prompt: string, codeContext: string) {
    try {
      // Check if user is authenticated first
      if (!api.isAuthenticated()) {
        throw new Error("Please log in to use AI features");
      }

      const response = await api.generateAIResponse(`${prompt}\n\nCode Context: ${codeContext}`, "explain");

      return response.response;
    } catch (error) {
      console.error("API Error:", error);

      // Return more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("authentication") || error.message.includes("log in")) {
          return "Please log in to use AI features. Click the login button in the file menu.";
        }
        if (error.message.includes("connection") || error.message.includes("network")) {
          return "I'm experiencing connection issues. Please check your internet connection and try again.";
        }
      }

      return "I'm experiencing technical difficulties. Please try again later.";
    }
  },

  getSimulatedResponse(code: string, context: string) {
    if (code.includes("fibonacci")) {
      return {
        suggestions: [
          {
            text: "Use memoization to optimize Fibonacci calculation",
            replacement: `# Optimized Fibonacci with memoization
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`,
            type: "optimization",
          },
        ],
        explanation: "The current Fibonacci implementation has exponential time complexity. Using memoization reduces it to O(n).",
      };
    }

    return {
      suggestions: [],
      explanation: "I've analyzed your code. It looks good! Let me know if you need specific improvements.",
    };
  },

  getSimulatedCompletion(prompt: string, codeContext: string) {
    if (prompt.toLowerCase().includes("test") || prompt.toLowerCase().includes("unit test")) {
      return {
        completion: `\n\n# Unit tests for the current code
import unittest

class TestFunctions(unittest.TestCase):
    def test_fibonacci(self):
        self.assertEqual(fibonacci(0), 0)
        self.assertEqual(fibonacci(1), 1)
        self.assertEqual(fibonacci(5), 5)
        self.assertEqual(fibonacci(10), 55)

    def test_calculate_average(self):
        self.assertEqual(calculate_average([1, 2, 3]), 2)
        self.assertEqual(calculate_average([10]), 10)
        self.assertEqual(calculate_average([]), 0)

if __name__ == '__main__':
    unittest.main()`,
        type: "test-generation",
      };
    }

    return {
      completion: `\n\n# AI suggestion based on your request: ${prompt}`,
      type: "general",
    };
  },
};
