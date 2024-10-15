import { Provider } from '@nestjs/common';
import OpenAI from 'openai';
import { SAMBA_NOVA_MODEL } from './samba-nova.constant';
import { env } from '~shared/configs/env.config';

export const SambaNovaModelProvider: Provider<OpenAI> = {
  provide: SAMBA_NOVA_MODEL,
  useFactory: () => {
    const genAi = new OpenAI({
      baseURL: env.SAMBA_NOVA.BASE_URL,
      apiKey: env.SAMBA_NOVA.KEY,
    });
    return genAi;
  },
};
