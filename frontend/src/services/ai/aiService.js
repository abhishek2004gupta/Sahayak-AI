import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAHG-MmtVIqb99rF58zUisj8BGP2gyO9c8";
const genAI = new GoogleGenerativeAI(apiKey);

// Token length options as requested
export const TOKEN_LENGTHS = [50, 100, 200, 350, 500, 700, 900, 1000];

export class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }

  async generateResponse(prompt, maxTokens = 500) {
    try {
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: maxTokens,
        responseMimeType: "text/plain",
      };

      const chatSession = this.model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to generate response");
    }
  }

  // Method to generate response with specific token length
  async generateWithTokenLength(prompt, tokenLength) {
    if (!TOKEN_LENGTHS.includes(tokenLength)) {
      throw new Error(`Invalid token length. Must be one of: ${TOKEN_LENGTHS.join(', ')}`);
    }
    return this.generateResponse(prompt, tokenLength);
  }
}

export default new AIService(); 