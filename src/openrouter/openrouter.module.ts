import { Module } from '@nestjs/common';
import { OpenrouterService } from './application/openrouter.service';
import { OpenRouterModelProvider } from './application/openrouter.provider';

@Module({
  providers: [OpenrouterService, OpenRouterModelProvider],
  exports: [OpenrouterService],
})
export class OpenrouterModule {}
