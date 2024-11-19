import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '~gemini/application/gemini.service';
import { OpenrouterService } from '~openrouter/application/openrouter.service';
import { CrochetPattern } from '~pattern/domain/interfaces/pattern.type';
import { PatternDecoderResponse } from '~pattern/domain/interfaces/response.type';
import { PROVIDER } from './pattern.constant';
import { GenAiResponse } from '~shared/interfaces/genai-response.type';
import { CROMLToJSONConverter } from '~pattern/helpers/croml-to-json.helper';
import { SambaNovaService } from '~samba-nova/application/samba-nova.service';

@Injectable()
export class PatternService {
  private defaultProvider: PROVIDER = PROVIDER.GEMINI;
  private readonly logger = new Logger(PatternService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly openrouterService: OpenrouterService,
    private readonly sambaNovaService: SambaNovaService,
    private readonly cromlToJsonsConverter: CROMLToJSONConverter,
  ) { }

  private async callProvider(
    provider: PROVIDER,
    pattern: string,
  ): Promise<GenAiResponse> {
    switch (provider) {
      case PROVIDER.GEMINI:
        return await this.geminiService.generateText(pattern);
      case PROVIDER.OPENROUTER:
        return await this.openrouterService.generateText(pattern);
      case PROVIDER.SAMBA_NOVA:
        return await this.sambaNovaService.generateText(pattern);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async executeWithFallback(
    pattern: string,
    providers: PROVIDER[],
  ): Promise<GenAiResponse> {
    for (const provider of providers) {
      try {
        const response = await this.callProvider(provider, pattern);
        this.defaultProvider = provider;
        return response;
      } catch (error) {
        this.logger.error(
          `Provider ${provider} failed. Error: ${error.message}`,
        );
      }
    }
    throw new Error('All providers failed');
  }

  async decodePattern(param: {
    pattern: string;
    provider?: PROVIDER;
  }): Promise<PatternDecoderResponse> {
    const providersOrder = param.provider
      ? [param.provider, ...Object.values(PROVIDER).filter((p) => p !== param.provider)]
      : [this.defaultProvider, ...Object.values(PROVIDER).filter((p) => p !== this.defaultProvider)];

    const response = await this.executeWithFallback(param.pattern, providersOrder);

    const patternCROML: string = response.text;
    const patternJSON: CrochetPattern = this.cromlToJsonsConverter.convert(patternCROML);

    return {
      pattern: patternJSON,
      totalPart: patternJSON.parts.length,
    };
  }

  async decodeToCROML(param: {
    pattern: string;
    provider?: PROVIDER;
  }): Promise<Object> {
    const providersOrder = param.provider
      ? [param.provider, ...Object.values(PROVIDER).filter((p) => p !== param.provider)]
      : [this.defaultProvider, ...Object.values(PROVIDER).filter((p) => p !== this.defaultProvider)];

    const response = await this.executeWithFallback(param.pattern, providersOrder);

    return {
      data: response.text,
      status: 'success',
    };
  }
}
