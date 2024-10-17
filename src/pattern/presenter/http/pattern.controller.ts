import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PatternDecoderDto } from './dto/pattern.dto';
import { ApiKeyGuard } from './guards/api-key.guard';
import { PatternService } from '~pattern/application/pattern.service';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Pattern Decoder')
@UseGuards(ApiKeyGuard)
@UseGuards(ThrottlerGuard)
@Controller({
  path: 'pattern',
  version: '1',
})
export class PatternController {
  constructor(private readonly patternDecoderService: PatternService) { }

  @ApiBody({
    description: 'The pattern to decode',
    required: true,
    type: PatternDecoderDto,
  })
  @Post('decode')
  async decodePattern(@Body() dto: PatternDecoderDto) {
    return this.patternDecoderService.decodePattern({
      pattern: dto.pattern,
      provider: dto.provider,
    });
  }

  @ApiBody({
    description: 'The pattern to decode',
    required: true,
    type: PatternDecoderDto,
  })
  @Post('decode/croml')
  @SkipThrottle()
  async decodeToCROML(@Body() dto: PatternDecoderDto) {
    return this.patternDecoderService.decodeToCROML({
      pattern: dto.pattern,
      provider: dto.provider,
    });
  }
}
