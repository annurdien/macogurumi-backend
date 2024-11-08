import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { CreateHighlightDto, Order, UpdateHighlightDto } from './highlight.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller({
    path: 'highlight',
    version: '1',
})

export class HighlightController {
    constructor(private readonly highlightService: HighlightService) { }

    @Post()
    async create(@Body() body: CreateHighlightDto) {
        return this.highlightService.create(body);
    }

    @Patch(':project/:timestamp')
    async update(
        @Param('project') project: string,
        @Param('timestamp') timestamp: number,
        @Body() body: UpdateHighlightDto
    ) {
        return this.highlightService.update({ project, timestamp }, body);
    }

    @Delete(':project/:timestamp')
    async delete(
        @Param('project') project: string,
        @Param('timestamp') timestamp: number
    ) {
        return this.highlightService.delete({ project, timestamp });
    }

    @Get(':project/:timestamp')
    async findOne(
        @Param('project') project: string,
        @Param('timestamp') timestamp: number
    ) {
        const highlight = await this.highlightService.findOne({ project, timestamp });
        if (!highlight) {
            throw new NotFoundException();
        }
        return highlight;
    }

    @SkipThrottle()
    @Get()
    async findAll(
        @Query('order') order?: Order,
        @Query('limit') limit?: string,
        @Query('lastEvaluatedKey') lastEvaluatedKey?: string // Note: Accepting as a string initially
    ) {
        const parsedLimit = limit ? parseInt(limit, 0) : undefined;
        if (isNaN(parsedLimit ?? 0) && parsedLimit !== undefined) {
            throw new BadRequestException('Limit must be a number');
        }

        let parsedLastEvaluatedKey;
        try {
            parsedLastEvaluatedKey = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined;
        } catch (e) {
            throw new BadRequestException('Invalid format for lastEvaluatedKey');
        }

        return this.highlightService.findAll(
            order,
            parsedLimit,
            parsedLastEvaluatedKey
        );
    }
}
