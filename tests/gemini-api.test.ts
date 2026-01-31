import { describe, it, expect } from "vitest";
import axios from "axios";

describe("Google Gemini API Integration", () => {
  it("should validate Gemini API Key by making a test request", async () => {
    const apiKey = process.env.GROQ_API_KEY; // Reusing the env var for Gemini API key
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "Say 'Gemini API Key is valid' if you receive this message.",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 50,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("candidates");
      expect(response.data.candidates).toHaveLength(1);
      expect(response.data.candidates[0]).toHaveProperty("content");
      expect(response.data.candidates[0].content).toHaveProperty("parts");
      expect(response.data.candidates[0].content.parts).toHaveLength(1);
      expect(response.data.candidates[0].content.parts[0]).toHaveProperty("text");
      
      const content = response.data.candidates[0].content.parts[0].text;
      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Invalid Gemini API Key - Authentication failed");
      }
      if (error.response?.status === 400) {
        throw new Error("Bad request to Gemini API - Check API key and request format");
      }
      throw error;
    }
  });
});
