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
  AWS: {
    REGION: process.env.AWS_REGION,
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    IS_DDB_LOCAL: process.env.IS_DDB_LOCAL === 'true',
    SERVICE: process.env.SERVICE,
    STAGE: process.env.STAGE,
  },
  R2: {
    BUCKET_NAME: process.env.R2_BUCKET_NAME || '',
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
    ENDPOINT: process.env.R2_ENDPOINT || '',
  }
};
