import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly geminiService: GeminiService,
    private readonly openrouterService: OpenrouterService,
    private readonly sambaNovaService: SambaNovaService,
    private readonly cromlToJsonsConverter: CROMLToJSONConverter,
  ) { }

  async decodePattern(param: { pattern: string; provider?: PROVIDER }): Promise<PatternDecoderResponse> {
    let response: GenAiResponse;

    switch (param.provider) {
      case PROVIDER.GEMINI:
        response = await this.geminiService.generateText(param.pattern);
        break;
      case PROVIDER.OPENROUTER:
        response = await this.openrouterService.generateText(param.pattern);
        break;
      case PROVIDER.SAMBA_NOVA:
        response = await this.sambaNovaService.generateText(param.pattern);
        break;
      default:
        response = await this.geminiService.generateText(param.pattern);
    }

    let patternCROML: string = response.text;
    let patternJSON: CrochetPattern = this.cromlToJsonsConverter.convert(patternCROML);

    return {
      pattern: patternJSON,
      totalPart: patternJSON.parts.length,
    };
  }

  async decodeToCROML(param: { pattern: string; provider?: PROVIDER }): Promise<Object> {
    let response: GenAiResponse;

    if (!param.provider) {
      response = await this.geminiService.generateText(param.pattern);
    }

    switch (param.provider) {
      case PROVIDER.GEMINI:
        response = await this.geminiService.generateText(param.pattern);
        break;
      case PROVIDER.OPENROUTER:
        response = await this.openrouterService.generateText(param.pattern);
        break;
      case PROVIDER.SAMBA_NOVA:
        response = await this.sambaNovaService.generateText(param.pattern);
        break;
      default:
        response = await this.geminiService.generateText(param.pattern);
    }

    let patternCROML: string = response.text;

    return {
      data: patternCROML,
      status: 'success',
    };
  }
}
