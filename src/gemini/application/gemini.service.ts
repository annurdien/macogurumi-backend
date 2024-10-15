import { GenerativeModel, GoogleGenerativeAIError } from '@google/generative-ai';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GEMINI_PRO_MODEL } from './gemini.constant';
import { createContent } from './helpers/content.helper';
import { GenAiResponse } from '~shared/interfaces/genai-response.type';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(@Inject(GEMINI_PRO_MODEL) private readonly proModel: GenerativeModel) {}

  async generateText(prompt: string): Promise<GenAiResponse> {
    try {
      const contents = createContent(prompt);

      const { totalTokens } = await this.proModel.countTokens({ contents });
      this.logger.debug(`Model: ${this.proModel.model}`);
      this.logger.debug(`Tokens: ${JSON.stringify(totalTokens)}`);

      const result = await this.proModel.generateContent({ contents });
      const response = result.response;
      const text = response.text();

      this.logger.debug(JSON.stringify(text));
      return { totalTokens, text };
    } catch (error) {
      this.logger.error(`Error generating text with Gemini: ${error}`);

      if (error instanceof GoogleGenerativeAIError) {
        this.logger.error(`Gemini API Error: ${error.stack} - ${error.message}`);

        throw new Error(`Gemini API Error: ${error.message} (Code: ${error.name || 'UNKNOWN'})`);
      } else {
        throw new Error('Failed to generate text with Gemini');
      }
    }
  }
}
