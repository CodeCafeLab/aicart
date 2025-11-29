import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const GEMINI_API_KEY =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "AIzaSyDJqjOnr3brcaknPlk-c3UxxuXoKx2G1x0";

const GEMINI_MODEL =
  process.env.GOOGLE_GENAI_MODEL ||
  process.env.NEXT_PUBLIC_GEMINI_MODEL ||
  "googleai/gemini-2.0-flash";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: GEMINI_API_KEY,
    }),
  ],
  model: GEMINI_MODEL,
});
