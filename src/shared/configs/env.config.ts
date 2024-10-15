import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  GEMINI: {
    KEY: process.env.GEMINI_API_KEY || '',
    PRO_MODEL: process.env.GEMINI_PRO_MODEL || 'gemini-1.5-pro',
  },
  OPENROUTER: {
    KEY: process.env.OPENROUTER_API_KEY || '',
    FREE_MODEL: process.env.OPENROUTER_FREE_MODEL || 'meta-llama/llama-3.1-405b-instruct:free',
    BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  },
  SAMBA_NOVA: {
    KEY: process.env.SAMBA_NOVA_API_KEY || '',
    MODEL: process.env.SAMBA_NOVA_MODEL || 'Meta-Llama-3.1-405B-Instruct',
    BASE_URL: process.env.SAMBA_NOVA_BASE_URL || 'https://api.sambanova.ai/v1',
  },
  API: {
    KEY: process.env.X_API_KEY || '',
  },
};
