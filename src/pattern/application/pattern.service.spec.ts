import { Test, TestingModule } from '@nestjs/testing';
import { PatternService } from './pattern.service';
import { GeminiService } from '~gemini/application/gemini.service';
import { OpenrouterService } from '~openrouter/application/openrouter.service';
import { PROVIDER } from './pattern.constant';
import { GenAiResponse } from '~shared/interfaces/genai-response.type';
import { CROMLToJSONConverter } from '~pattern/helpers/croml-to-json.helper';
import { Pattern } from '~pattern/domain/interfaces/pattern.type';

describe('PatterDecoderService', () => {
  let service: PatternService;
  let geminiService: GeminiService;
  let openrouterService: OpenrouterService;
  let cromlToJsonsConverter: CROMLToJSONConverter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatternService,
        {
          provide: GeminiService,
          useValue: {
            generateText: jest.fn(),
          },
        },
        {
          provide: OpenrouterService,
          useValue: {
            generateText: jest.fn(),
          },
        },
        {
          provide: CROMLToJSONConverter,
          useValue: {
            convert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatternService>(PatternService);
    geminiService = module.get<GeminiService>(GeminiService);
    openrouterService = module.get<OpenrouterService>(OpenrouterService);
    cromlToJsonsConverter = module.get<CROMLToJSONConverter>(CROMLToJSONConverter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodePattern', () => {
    it('should decode pattern using OpenRouter when no provider is specified', async () => {
      const pattern = 'test pattern';
      const mockResponse: GenAiResponse = {
        text: '{"parts": []}',
        totalTokens: 0,
      };
      const mockPatternJSON = { parts: [] };

      jest.spyOn(openrouterService, 'generateText').mockResolvedValue(mockResponse);
      jest.spyOn(cromlToJsonsConverter, 'convert').mockReturnValue(mockPatternJSON);

      const result = await service.decodePattern({ pattern });

      expect(openrouterService.generateText).toHaveBeenCalledWith(pattern);
      expect(cromlToJsonsConverter.convert).toHaveBeenCalledWith(mockResponse.text);
      expect(result).toEqual({
        pattern: mockPatternJSON,
        totalPart: 0,
      });
    });

    it('should decode pattern using Gemini when provider is GEMINI', async () => {
      const pattern = 'test pattern';
      const mockResponse: GenAiResponse = {
        text: '{"parts": [{"name": "part1"}]}',
        totalTokens: 0,
      };
      const mockPatternJSON: Pattern = { parts: [{ name: 'part1', layers: [] }] };

      jest.spyOn(geminiService, 'generateText').mockResolvedValue(mockResponse);
      jest.spyOn(cromlToJsonsConverter, 'convert').mockReturnValue(mockPatternJSON);

      const result = await service.decodePattern({ pattern, provider: PROVIDER.GEMINI });

      expect(geminiService.generateText).toHaveBeenCalledWith(pattern);
      expect(cromlToJsonsConverter.convert).toHaveBeenCalledWith(mockResponse.text);
      expect(result).toEqual({
        pattern: mockPatternJSON,
        totalPart: 1,
      });
    });

    it('should decode pattern using OpenRouter when provider is OPENROUTER', async () => {
      const pattern = 'test pattern';
      const mockResponse: GenAiResponse = {
        text: '{"parts": []}',
        totalTokens: 0,
      };
      const mockPatternJSON = { parts: [] };

      jest.spyOn(openrouterService, 'generateText').mockResolvedValue(mockResponse);
      jest.spyOn(cromlToJsonsConverter, 'convert').mockReturnValue(mockPatternJSON);

      const result = await service.decodePattern({ pattern, provider: PROVIDER.OPENROUTER });

      expect(openrouterService.generateText).toHaveBeenCalledWith(pattern);
      expect(cromlToJsonsConverter.convert).toHaveBeenCalledWith(mockResponse.text);
      expect(result).toEqual({
        pattern: mockPatternJSON,
        totalPart: 0,
      });
    });
  });
});
