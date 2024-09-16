import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiModule } from './gemini/gemini.module';
import { OpenrouterModule } from './openrouter/openrouter.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [GeminiModule, OpenrouterModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
