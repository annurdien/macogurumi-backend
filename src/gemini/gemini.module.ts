import { Module } from '@nestjs/common';
import { GeminiService } from './application/gemini.service';
import { GeminiProModelProvider } from './application/gemini.provider';

@Module({
  providers: [GeminiService, GeminiProModelProvider],
  controllers: [],
  exports: [GeminiService],
})
export class GeminiModule {}
