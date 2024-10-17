import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiModule } from './gemini/gemini.module';
import { OpenrouterModule } from './openrouter/openrouter.module';
import { SharedModule } from './shared/shared.module';
import { PatternModule } from '~pattern/pattern.module';
import { SambaNovaModule } from './samba-nova/samba-nova.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    GeminiModule,
    OpenrouterModule,
    SharedModule,
    PatternModule,
    SambaNovaModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 10 request per minute per IP
        limit: 10
      }
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
