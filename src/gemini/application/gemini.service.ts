import { GenerativeModel } from '@google/generative-ai';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GEMINI_PRO_MODEL } from './gemini.constant';
import { GeminiGenAiResponse } from '~gemini/domain/interface/response.interface';
import { createContent } from './helpers/content.helper';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(@Inject(GEMINI_PRO_MODEL) private readonly proModel: GenerativeModel) {}

  async generateText(prompt: string): Promise<GeminiGenAiResponse> {
    const contents = createContent(prompt);

    const { totalTokens } = await this.proModel.countTokens({ contents });
    this.logger.log(`Tokens: ${JSON.stringify(totalTokens)}`);

    const result = await this.proModel.generateContent({ contents });
    const response = result.response;
    const text = response.text();

    this.logger.log(JSON.stringify(text));
    return { totalTokens, text };
  }
}
