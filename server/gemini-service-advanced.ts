import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY (Gemini API key) is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// List of Gemini models to try in order (from most powerful to fallback)
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-pro",
];

interface ConversationHistory {
  projectId: number;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Store conversation histories in memory (in production, use database)
const conversationHistories: Map<number, ConversationHistory> = new Map();

/**
 * Get the best available model with fallback support
 */
async function getAvailableModel() {
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test if model is available
      await model.generateContent("test");
      console.log(`Using model: ${modelName}`);
      return model;
    } catch (error: any) {
      if (error.status === 429) {
        console.warn(`Model ${modelName} rate limited, trying next...`);
        continue;
      }
      console.warn(`Model ${modelName} not available, trying next...`);
      continue;
    }
  }

  // Fallback to first model if all fail
  console.warn("All models unavailable, using fallback");
  return genAI.getGenerativeModel({ model: GEMINI_MODELS[0] });
}

/**
 * Generate app code using Gemini AI with conversation history
 */
export async function generateAppCodeWithHistory(
  projectId: number,
  prompt: string,
  previousMessages?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    const model = await getAvailableModel();

    const systemPrompt = `You are an expert React Native and Expo app developer. 
Your task is to generate a complete, production-ready React Native app based on user requirements.

Generate ONLY the code and project structure. Include:
1. App structure with proper folder organization
2. Main screens/components
3. Navigation setup
4. Styling with NativeWind/Tailwind
5. Any necessary dependencies

Format your response as a JSON object with this structure:
{
  "projectName": "string",
  "description": "string",
  "files": [
    {
      "path": "string (e.g., 'app/(tabs)/index.tsx')",
      "content": "string (file content)"
    }
  ],
  "dependencies": ["string array of npm packages"],
  "instructions": "string (setup instructions)"
}

Make sure the code is:
- Complete and runnable
- Uses React Native best practices
- Compatible with Expo
- Properly typed with TypeScript
- Uses NativeWind for styling`;

    // Build full prompt with history
    let fullPrompt = systemPrompt + "\n\n";

    if (previousMessages) {
      for (const msg of previousMessages) {
        fullPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      }
    }

    fullPrompt += `USER: ${prompt}`;

    // Store in history
    if (!conversationHistories.has(projectId)) {
      conversationHistories.set(projectId, {
        projectId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const history = conversationHistories.get(projectId)!;
    history.messages.push({ role: "user", content: prompt });
    history.updatedAt = new Date();

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Store assistant response in history
    history.messages.push({ role: "assistant", content: text });

    return text;
  } catch (error) {
    console.error("Error generating app code:", error);
    throw new Error(
      `Failed to generate app code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate app code with streaming and history
 */
export async function* generateAppCodeStreamWithHistory(
  projectId: number,
  prompt: string,
  previousMessages?: Array<{ role: "user" | "assistant"; content: string }>
): AsyncGenerator<string> {
  try {
    const model = await getAvailableModel();

    const systemPrompt = `You are an expert React Native and Expo app developer. 
Your task is to generate a complete, production-ready React Native app based on user requirements.

Generate ONLY the code and project structure. Include:
1. App structure with proper folder organization
2. Main screens/components
3. Navigation setup
4. Styling with NativeWind/Tailwind
5. Any necessary dependencies

Format your response as a JSON object with this structure:
{
  "projectName": "string",
  "description": "string",
  "files": [
    {
      "path": "string (e.g., 'app/(tabs)/index.tsx')",
      "content": "string (file content)"
    }
  ],
  "dependencies": ["string array of npm packages"],
  "instructions": "string (setup instructions)"
}

Make sure the code is:
- Complete and runnable
- Uses React Native best practices
- Compatible with Expo
- Properly typed with TypeScript
- Uses NativeWind for styling`;

    // Build full prompt with history
    let fullPrompt = systemPrompt + "\n\n";

    if (previousMessages) {
      for (const msg of previousMessages) {
        fullPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      }
    }

    fullPrompt += `USER: ${prompt}`;

    // Store in history
    if (!conversationHistories.has(projectId)) {
      conversationHistories.set(projectId, {
        projectId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const history = conversationHistories.get(projectId)!;
    history.messages.push({ role: "user", content: prompt });
    history.updatedAt = new Date();

    // Generate content with streaming
    const stream = await model.generateContentStream(fullPrompt);

    let fullResponse = "";

    for await (const chunk of stream.stream) {
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = chunk.candidates[0].content.parts[0].text;
        fullResponse += text;
        yield text;
      }
    }

    // Store full response in history
    history.messages.push({ role: "assistant", content: fullResponse });
  } catch (error) {
    console.error("Error generating app code stream:", error);
    throw new Error(
      `Failed to generate app code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get conversation history for a project
 */
export function getConversationHistory(projectId: number) {
  return conversationHistories.get(projectId);
}

/**
 * Clear conversation history for a project
 */
export function clearConversationHistory(projectId: number) {
  conversationHistories.delete(projectId);
}

/**
 * Get all conversation histories
 */
export function getAllConversationHistories() {
  return Array.from(conversationHistories.values());
}

/**
 * Parse generated code JSON response
 */
export interface GeneratedProject {
  projectName: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  dependencies: string[];
  instructions: string;
}

export function parseGeneratedCode(jsonString: string): GeneratedProject {
  try {
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (
      !parsed.projectName ||
      !parsed.description ||
      !Array.isArray(parsed.files) ||
      !Array.isArray(parsed.dependencies)
    ) {
      throw new Error("Invalid project structure");
    }

    return parsed as GeneratedProject;
  } catch (error) {
    console.error("Error parsing generated code:", error);
    throw new Error(
      `Failed to parse generated code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Refine existing code based on user feedback with history
 */
export async function refineAppCodeWithHistory(
  projectId: number,
  feedback: string
): Promise<string> {
  try {
    const history = conversationHistories.get(projectId);
    if (!history) {
      throw new Error("No conversation history found for this project");
    }

    return await generateAppCodeWithHistory(projectId, feedback, history.messages);
  } catch (error) {
    console.error("Error refining app code:", error);
    throw new Error(
      `Failed to refine app code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
