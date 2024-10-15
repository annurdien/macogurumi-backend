import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PROVIDER } from '~pattern/application/pattern.constant';

export class PatternDecoderDto {
  @ApiProperty({
    name: 'pattern',
    description: 'The pattern to decode',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pattern: string;

  @ApiProperty({
    name: 'provider',
    description: 'The LLM provider to use',
    type: 'string',
    required: false,
    enum: PROVIDER,
    default: PROVIDER.GEMINI,
    enumName: 'PROVIDER',
  })
  @IsNotEmpty()
  @IsString()
  provider?: PROVIDER;
}
