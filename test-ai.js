import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "hello",
      config: {
        maxOutputTokens: 10,
        temperature: 0,
      }
    });
    console.log("gemini-3.8-flash success:", response.text);
  } catch(e) {
    console.error("3.8 error:", e.message);
  }
}
run();
