import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { env } from '~shared/configs/env.config';
import { GEMINI_GENERATION_CONFIG, GEMINI_SAFETY_SETTINGS } from '~shared/configs/gemini.config';
import { GEMINI_PRO_MODEL } from './gemini.constant';
import { GENAI_SYSTEM_MESSAGE_BASE_64 } from '~shared/constant/system-message.constant';

export const GeminiProModelProvider: Provider<GenerativeModel> = {
  provide: GEMINI_PRO_MODEL,
  useFactory: () => {
    const genAI = new GoogleGenerativeAI(env.GEMINI.KEY);
    return genAI.getGenerativeModel({
      model: env.GEMINI.PRO_MODEL,
      generationConfig: GEMINI_GENERATION_CONFIG,
      safetySettings: GEMINI_SAFETY_SETTINGS,
      systemInstruction: atob(GENAI_SYSTEM_MESSAGE_BASE_64),
    });
  },
};
