
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

export const extractDocumentData = async (base64Data: string, mimeType: string): Promise<ExtractedData> => {
  // Try getting key from process.env (Vite define) or import.meta.env (Vite standard)
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API Key not found. Please check your .env file and restart your terminal.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `Act as an expert administrative document processor for official identity documents.
            This document is likely a Moroccan "Carte d'Identité Nationale" (CIN), Driving License, or Vehicle Registration.
            
            Extract the following fields accurately, handling both French and Arabic text:
            - Full Name: Look for "Nom", "Prénom", or their Arabic equivalents (الإسم الكامل).
            - ID Number: The unique identification number of the document.
            - Birth Date: Format as YYYY-MM-DD.
            - Expiry Date: Format as YYYY-MM-DD.
            - Address: The full residential address.
            
            Identify the document type as 'CIN', 'Driving License', or 'Vehicle Registration'.
            Return ONLY a valid JSON object matching the provided schema.`
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: {
              type: Type.STRING,
              description: "The type of document: 'CIN', 'Driving License', 'Vehicle Registration', or 'Unknown'",
            },
            fullName: { type: Type.STRING },
            idNumber: { type: Type.STRING },
            birthDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
            expiryDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
            address: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
          },
          required: ["documentType", "confidence"]
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI.");
    
    return JSON.parse(text) as ExtractedData;
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please verify it in Google AI Studio.");
    }
    
    throw new Error(error.message || "Failed to parse document. Please ensure the scan is high quality.");
  }
};
