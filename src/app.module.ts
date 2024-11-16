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
import { HighlightModule } from './highlight/highlight.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { env } from '~shared/configs/env.config';
import { R2Module } from './r2/r2.module';

@Module({
  imports: [
    GeminiModule,
    OpenrouterModule,
    SharedModule,
    PatternModule,
    SambaNovaModule,
    R2Module,
    HighlightModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 10 request per minute per IP
        limit: 100
      }
    ]),
    DynamooseModule.forRoot({
      local: env.AWS.IS_DDB_LOCAL,
      aws: { region: env.AWS.REGION },
      table: {
        create: env.AWS.IS_DDB_LOCAL,
        prefix: `${env.AWS.SERVICE}-${env.AWS.STAGE}-`,
        suffix: '-table',
      },
    }),
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
