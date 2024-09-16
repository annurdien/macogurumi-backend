import { Injectable, Provider } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENROUTER_MODEL } from './openrouter.constant';
import { env } from '~shared/configs/env.config';

export const OpenRouterModelProvider: Provider<OpenAI> = {
    provide: OPENROUTER_MODEL,
    useFactory: () => {
        const genAi = new OpenAI({
            baseURL: env.OPENROUTER.BASE_URL,
            apiKey: env.OPENROUTER.KEY,
        });
        return genAi;
    }
}
