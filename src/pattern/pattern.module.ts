import { Module } from '@nestjs/common';
import { GeminiModule } from '~gemini/gemini.module';
import { SambaNovaModule } from '~samba-nova/samba-nova.module';
import { OpenrouterModule } from '~openrouter/openrouter.module';
import { PatternController } from './presenter/http/pattern.controller';
import { PatternService } from './application/pattern.service';
import { CROMLToJSONConverter } from './helpers/croml-to-json.helper';

@Module({
  imports: [GeminiModule, OpenrouterModule, SambaNovaModule],
  controllers: [PatternController],
  providers: [PatternService, CROMLToJSONConverter],
  exports: [PatternService],
})
export class PatternModule { }
