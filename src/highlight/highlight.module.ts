import { Module } from '@nestjs/common';
import { HighlightController } from './highlight.controller';
import { HighlightService } from './highlight.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { HighlightSchema } from './highlight.schema';

@Module({
    imports: [
        DynamooseModule.forFeature([
            {
                name: 'Highlight',
                schema: HighlightSchema,
                options: {
                    tableName: 'highlight'
                }
            },
        ]),
    ],
    providers: [HighlightService],
    controllers: [HighlightController]
})

export class HighlightModule { }
