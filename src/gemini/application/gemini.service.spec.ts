import { Test, TestingModule } from '@nestjs/testing';
import { GeminiService } from './gemini.service';
import { GenerativeModel } from '@google/generative-ai';
import { GEMINI_PRO_MODEL } from './gemini.constant';
import { GenAiResponse } from '~shared/interfaces/genai-response.type'; 

describe('GeminiService', () => {
  let service: GeminiService;
  const mockProModel: Partial<GenerativeModel> = {
    countTokens: jest.fn().mockResolvedValue({ totalTokens: 10 }),
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: jest.fn().mockReturnValue('Generated text'),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: GEMINI_PRO_MODEL,
          useValue: mockProModel,
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate text', async () => {
    const prompt = 'Test prompt';
    const expectedResponse: GenAiResponse = {
      totalTokens: 10,
      text: 'Generated text',
    };

    const response = await service.generateText(prompt);

    expect(mockProModel.countTokens).toHaveBeenCalledWith({
      contents: expect.any(Array),
    });
    expect(mockProModel.generateContent).toHaveBeenCalledWith({
      contents: expect.any(Array),
    });
    expect(response).toEqual(expectedResponse);
  });
});
