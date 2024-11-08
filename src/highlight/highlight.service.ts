import { InjectModel, Model } from "nestjs-dynamoose";
import * as uuid from 'uuid';

import { Injectable } from "@nestjs/common";

import { Highlight, HighlightKey } from "./highlight.interface";
import { CreateHighlightDto, Order, UpdateHighlightDto } from "./highlight.dto";
import { SortOrder } from "dynamoose/dist/General";


@Injectable()
export class HighlightService {
    constructor(
        @InjectModel('Highlight')
        private readonly model: Model<Highlight, HighlightKey>,
    ) { }


    async create(dto: CreateHighlightDto) {
        return this.model.create({
            project: 'kagibari',
            ...dto,
            timestamp: Date.now(),
        });
    }

    async update(key: HighlightKey, dto: UpdateHighlightDto) {
        return this.model.update(key, dto);
    }

    async delete(key: HighlightKey) {
        return this.model.delete(key);
    }

    async findOne(key: HighlightKey) {
        return this.model.get(key);
    }

    async findAll(
        order: Order = Order.ASC,
        limit: number = 10,
        lastEvaluatedKey?: any
    ) {
        const query = this.model
            .query('project')
            .eq('kagibari')
            .sort(order === Order.ASC ? SortOrder.ascending : SortOrder.descending)
            .limit(limit);

        if (lastEvaluatedKey) {
            query.startAt(lastEvaluatedKey);
        }

        const result = await query.exec();
        return {
            items: result,
            lastEvaluatedKey: result.lastKey
        };
    }
}