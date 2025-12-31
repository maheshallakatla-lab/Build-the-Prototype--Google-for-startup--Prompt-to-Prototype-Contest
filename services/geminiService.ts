
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCareerRoadmap = async (goal: string) => {
  try {
    const prompt = `As a world-class career architect at the Mahesh Allakatla Training Centre, create a detailed step-by-step technical roadmap for someone wanting to: "${goal}". 
    
    Structure your response in Markdown:
    1. A brief visionary introduction (2 sentences).
    2. Phase-by-phase breakdown (3-4 phases).
    3. Specific technical skills for each phase.
    4. Suggested course from our institute (referencing Power BI, SQL, Microsoft Fabric, Azure Data Engineering, or Agentic AI Swarms if applicable).
    5. Estimated timeframe for mastery.
    
    Keep the tone professional, inspiring, and focused on "Excellence".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Sorry, I couldn't generate a roadmap at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI architect. Ensure your goal is clear and try again.";
  }
};
