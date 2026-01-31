import { describe, it, expect } from "vitest";
import axios from "axios";

describe("Groq API Integration", () => {
  it("should validate Groq API Key by making a test request", async () => {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: "Say 'API Key is valid' if you receive this message.",
            },
          ],
          max_tokens: 50,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("choices");
      expect(response.data.choices).toHaveLength(1);
      expect(response.data.choices[0]).toHaveProperty("message");
      expect(response.data.choices[0].message).toHaveProperty("content");
      
      const content = response.data.choices[0].message.content;
      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid Groq API Key - Authentication failed");
      }
      throw error;
    }
  });
});
