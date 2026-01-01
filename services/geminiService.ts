
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Fixed: Use process.env.API_KEY directly in initialization
export const analyzeResume = async (fileData?: string, textData?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let contentParts: any[] = [{ text: "Extract the key professional highlights, projects, and work history from this resume to help an interviewer ask better questions. Keep it to a 200-word summary." }];
  
  if (fileData) {
    contentParts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming image upload for simplicity in this web environment
        data: fileData
      }
    });
  } else if (textData) {
    contentParts.push({ text: textData });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contentParts },
    });
    // Property access .text instead of .text()
    return response.text;
  } catch (error) {
    return "Resume parsing failed. Rely on profile skills.";
  }
};

export const getGeminiPrepTips = async (companyName: string, role: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 5 concise, actionable interview preparation tips for a student applying to ${companyName} for the role of ${role}. Context: ${description}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tip: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["tip", "category"]
          }
        }
      }
    });
    // Property access .text instead of .text()
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const summarizeJD = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this job description into 3 bullet points: ${description}`,
    });
    // Property access .text instead of .text()
    return response.text || description;
  } catch (error) {
    return description;
  }
};

export const generateCoverLetter = async (user: any, company: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Draft a high-impact, professional cover letter for ${user.name}, a ${user.branch} student with ${user.cgpa} CGPA and skills in ${user.skills.join(', ')}. Applying for ${company.role} at ${company.name}. Keep it concise and persuasive.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  // Property access .text instead of .text()
  return response.text || '';
};

export const generateQuiz = async (skills: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 10 high-quality multiple choice interview questions based on these skills: ${skills.join(', ')}. 
    Vary difficulty from beginner to advanced. Ensure the questions are technically accurate and the explanations are helpful.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    }
  });
  // Property access .text instead of .text()
  return JSON.parse(response.text || '[]');
};
