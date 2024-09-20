import { OpenAI, APIError } from 'openai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OPENROUTER_CONFIG, OPENROUTER_MODEL } from './openrouter.constant';
import { GenAiResponse } from '~shared/interfaces/genai-response.type';
import { env } from '~shared/configs/env.config';
import { createSystemMessage, createUserMessage } from './helpers/message.helper';
import { GENAI_SYSTEM_MESSAGE_BASE_64 } from '~shared/constant/system-message.constant';

@Injectable()
export class OpenrouterService {
  private readonly logger = new Logger(OpenrouterService.name);

  constructor(@Inject(OPENROUTER_MODEL) private readonly openrouter: OpenAI) {}

  async generateText(prompt: string): Promise<GenAiResponse> {
    try {
      const systemMessage = createSystemMessage(atob(GENAI_SYSTEM_MESSAGE_BASE_64));

      const completion = await this.openrouter.chat.completions.create({
        max_tokens: OPENROUTER_CONFIG.max_tokens,
        temperature: OPENROUTER_CONFIG.temperature,
        top_p: OPENROUTER_CONFIG.top_p,
        model: env.OPENROUTER.FREE_MODEL,
        messages: [systemMessage, createUserMessage(prompt)],
      });

      const totalTokens = completion.usage?.total_tokens || 0;
      const text = completion.choices[0]?.message?.content || '';

      this.logger.log(`Total Token: ${totalTokens}`)
      this.logger.log(`OpenRouter response: ${JSON.stringify({ text })}`);

      return { totalTokens, text };
    } catch (error) {
      this.logger.error(`Error generating text with OpenRouter: ${error}`);

      if (error instanceof APIError) {
        throw new Error(`OpenRouter API Error: ${error.message} (Code: ${error.code})`);
      } else {
        throw new Error('Failed to generate text with OpenRouter');
      }
    }
  }
}
