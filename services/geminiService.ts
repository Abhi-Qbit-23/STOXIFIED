
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const geminiService = {
  summarizeNews: async (fullText: string): Promise<string> => {
    // API_KEY is now sourced directly from process.env
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      // This error will be thrown if process.env.API_KEY is not set in the environment.
      // The application now relies on the environment providing this.
      console.error("Gemini API key (process.env.API_KEY) is not configured.");
      throw new Error("Gemini API key is not configured in the environment.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Summarize the following stock market news article in 60-80 words. Focus on the key financial information, market impact, and main subjects. Make it concise and easy to read for a general audience interested in finance. Article: "${fullText}"`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        // Default thinking config is fine for summarization quality.
      });
      
      const summary = response.text;
      if (!summary) {
        // This case handles if the API returns a response but the text is empty.
        console.error("Received an empty summary from Gemini API.");
        throw new Error("Received an empty summary from Gemini API.");
      }
      return summary.trim();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Check if the error is due to an invalid API key, which might be set via process.env.API_KEY
      if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
         throw new Error("Invalid Gemini API Key. Please ensure process.env.API_KEY is valid.");
      }
      // General error for other API issues
      throw new Error(`Failed to summarize news using Gemini API. ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};
