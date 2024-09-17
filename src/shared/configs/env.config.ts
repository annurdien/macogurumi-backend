import 'dotenv/config'

export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  GEMINI: {
    KEY: process.env.GEMINI_API_KEY || '',
    PRO_MODEL: process.env.GEMINI_PRO_MODEL || 'gemini-1.5-pro',
  },
  OPENROUTER: {
    KEY: process.env.OPENROUTER_API_KEY || '',
    FREE_MODEL: process.env.OPENROUTER_FREE_MODEL || 'nousresearch/hermes-3-llama-3.1-405b:free',
    BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  },
  API: {
      KEY: process.env.X_API_KEY || '',
  }
};
