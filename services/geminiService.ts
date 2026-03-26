import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSmartQRContent = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Missing API Key");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert QR Code Data Formatter. Your job is to translate natural language requests into the standard raw string formats used by QR code readers.

Supported Formats & Rules:
1. **URL**: Return the full valid URL (e.g., https://example.com).
2. **WiFi**: Format: WIFI:S:MySSID;T:WPA;P:MyPass;; (Use T:nopass for open networks).
3. **vCard (Contact)**: Use standard BEGIN:VCARD ... END:VCARD format (Version 3.0 preferred).
4. **Email**: Format: mailto:name@example.com?subject=...&body=...
5. **SMS**: Format: SMSTO:+1234567890:Message_Text
6. **Geo Location**: Format: geo:LAT,LONG
7. **Calendar Event**: BEGIN:VEVENT ... END:VEVENT

INSTRUCTIONS:
- Return ONLY the raw string data for the QR code. 
- Do NOT include markdown code blocks.
- Do NOT include explanations or conversational text.
- If the user input is ambiguous, default to plain text.
- If the user asks for a specific type (e.g., "Make a wifi code"), prioritize that format.`,
        temperature: 0.1, // Low temperature for deterministic formatting
      },
    });

    return response.text?.trim() || prompt;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};