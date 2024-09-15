import { Module } from '@nestjs/common';
import { GeminiService } from './application/gemini.service';
import { GeminiController } from './presenters/http/gemini.controller';

@Module({
  providers: [GeminiService],
  controllers: [GeminiController],
})
export class GeminiModule {}
