import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { CreateHighlightDto, UpdateHighlightDto } from './highlight.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller({
    path: 'highlight',
    version: '1',
})
@SkipThrottle()
export class HighlightController {
    constructor(private readonly highlightService: HighlightService) { }

    @Post()
    async create(@Body() body: CreateHighlightDto) {
        return this.highlightService.create(body);
    }

    @Patch(':project/:timestamp')
    async update(
        @Param('project') project: string,
        @Param('timestamp') timestamp: Number,
        @Body() body: UpdateHighlightDto
    ) {
        return this.highlightService.update({ project, timestamp }, body);
    }

    @Delete(':project/:timestamp')
    async delete(
        @Param('project') project: string,
        @Param('timestamp') timestamp: Number
    ) {
        return this.highlightService.delete({ project, timestamp });
    }

    @Get(':project/:timestamp')
    async findOne(
        @Param('project') project: string,
        @Param('timestamp') timestamp: Number
    ) {
        const highlight = await this.highlightService.findOne({ project, timestamp });
        if (!highlight) {
            throw new NotFoundException();
        }
        return highlight;
    }

    @Get()
    async findAll() {
        return this.highlightService.findAll();
    }
}
