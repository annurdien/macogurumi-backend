import { GenerationConfig, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';

export const GEMINI_GENERATION_CONFIG: GenerationConfig = {
  maxOutputTokens: 8192,
  temperature: 0.2,
  topK: 64,
  topP: 0.95,
};

export const GEMINI_SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
