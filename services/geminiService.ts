import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCompletion = async (
  prompt: string,
  context: string = ""
): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key not configured.";

  try {
    const model = "gemini-2.5-flash";
    const fullPrompt = `
      You are an intelligent writing assistant embedded in a documentation app.
      Context of current document: ${context}
      
      User Instruction: ${prompt}
      
      Provide a helpful, concise, and well-formatted response. Use Markdown if needed.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  const client = getClient();
  if (!client) return "";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text in one short paragraph:\n\n${text}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "";
  }
};
