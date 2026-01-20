import { GoogleGenAI } from "@google/genai";
import { AIGeneratedContent } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists (handled in calls safely)
const getClient = () => new GoogleGenAI({ apiKey });

export const generateBlogContent = async (topic: string, currentContent?: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = getClient();
  
  const systemInstruction = "You are an expert blog writer. You write engaging, well-structured, and clear content using Markdown formatting. Use headers, bold text, and lists where appropriate.";
  
  const prompt = currentContent 
    ? `Rewrite or expand upon the following blog draft about "${topic}". \n\nDraft:\n${currentContent}`
    : `Write a comprehensive, engaging blog post about: "${topic}". Include a catchy title in the first line if possible.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster drafting
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    throw error;
  }
};

export const generateBlogIdeas = async (): Promise<string[]> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = getClient();
  
  const prompt = "Generate 5 creative and trending blog post topic ideas for a personal tech and lifestyle blog. Return only the list as a JSON array of strings.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Ideas Error:", error);
    return [];
  }
};

export const generateCoverImage = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = getClient();

  try {
    // Using gemini-2.5-flash-image for generation as requested for general tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Generate a high quality, artistic, abstract cover image for a blog post about: ${prompt}. Aspect ratio 16:9.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    // Extract image from response parts
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};