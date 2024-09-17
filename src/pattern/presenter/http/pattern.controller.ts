import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatternDecoderDto } from './dto/pattern.dto';
import { ApiKeyGuard } from './guards/api-key.guard';
import { PatternService } from '~pattern/application/pattern.service';

@ApiTags('Pattern Decoder')
@UseGuards(ApiKeyGuard)
@Controller({
    path: 'pattern',
    version: '1'
})
export class PatternController {
    constructor(private readonly patternDecoderService: PatternService) {}

    @Post('decode')
    async decodePattern(
        @Body() dto: PatternDecoderDto
    ) {
        return this.patternDecoderService.decodePattern({
            pattern: dto.pattern,
            provider: dto.provider
        })
    }
}
