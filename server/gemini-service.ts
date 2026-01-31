import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY (Gemini API key) is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generate app code using Gemini AI
 * @param prompt User's app description/requirements
 * @returns Generated code and project structure
 */
export async function generateAppCode(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    const message = `${systemPrompt}\n\nUser Request: ${prompt}`;

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating app code:", error);
    throw new Error(`Failed to generate app code: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate app code with streaming
 * @param prompt User's app description/requirements
 * @returns AsyncGenerator that yields text chunks
 */
export async function* generateAppCodeStream(
  prompt: string
): AsyncGenerator<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    const message = `${systemPrompt}\n\nUser Request: ${prompt}`;

    const stream = await model.generateContentStream(message);

    for await (const chunk of stream.stream) {
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
        yield chunk.candidates[0].content.parts[0].text;
      }
    }
  } catch (error) {
    console.error("Error generating app code stream:", error);
    throw new Error(
      `Failed to generate app code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
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
 * Refine existing code based on user feedback
 */
export async function refineAppCode(
  originalPrompt: string,
  generatedCode: string,
  feedback: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const message = `You are a React Native developer. Here's an app that was generated based on this requirement:
"${originalPrompt}"

Generated code structure:
${generatedCode}

User feedback:
"${feedback}"

Please refine the code based on the feedback. Return the refined code in the same JSON format.`;

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error refining app code:", error);
    throw new Error(
      `Failed to refine app code: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
