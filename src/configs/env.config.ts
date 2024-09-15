import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  GEMINI: {
    KEY: process.env.GEMINI_API_KEY || '',
    PRO_MODEL: process.env.GEMINI_PRO_MODEL || 'gemini-pro',
  },
  OPENROUTER: {
    KEY: process.env.OPENROUTE_API_KEY || '',
    FREE_MODEL: process.env.OPENROUTE_FREE_MODEL || 'nousresearch/hermes-3-llama-3.1-405b:free',
    BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  }
};