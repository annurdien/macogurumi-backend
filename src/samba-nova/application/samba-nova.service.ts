import { Inject, Injectable, Logger } from '@nestjs/common';
import { SAMBA_NOVA_CONFIG, SAMBA_NOVA_MODEL } from './samba-nova.constant';
import { OpenAI, APIError } from 'openai';
import { GenAiResponse } from '~shared/interfaces/genai-response.type';
import { createSystemMessage, createUserMessage } from './helpers/message.helper';
import { GENAI_SYSTEM_MESSAGE_BASE_64 } from '~shared/constant/system-message.constant';
import { env } from '~shared/configs/env.config';

@Injectable()
export class SambaNovaService {
  private readonly logger = new Logger(SambaNovaService.name);

  constructor(@Inject(SAMBA_NOVA_MODEL) private readonly sambaNova: OpenAI) { }

  async generateText(prompt: string): Promise<GenAiResponse> {
    try {
      const systemMessage = createSystemMessage(atob(GENAI_SYSTEM_MESSAGE_BASE_64));

      const completion = await this.sambaNova.chat.completions.create({
        temperature: SAMBA_NOVA_CONFIG.temperature,
        top_p: SAMBA_NOVA_CONFIG.top_p,
        model: env.SAMBA_NOVA.MODEL,
        messages: [systemMessage, createUserMessage(prompt)],
      });

      const totalTokens = completion.usage?.total_tokens || 0;
      const text = completion.choices[0]?.message?.content || '';

      this.logger.debug(`Total Token: ${totalTokens}`);
      this.logger.debug(`Model: ${completion.model}`);
      this.logger.debug(`Samba Nova response: \n${text}`);

      return { totalTokens, text };
    } catch (error) {
      this.logger.error(`Error generating text with Samba Nova: ${error}`);

      if (error instanceof APIError) {
        throw new Error(`Samba Nova API Error: ${error.message} (Code: ${error.code})`);
      } else {
        throw new Error('Failed to generate text with Samba Nova');
      }
    }
  }
}
