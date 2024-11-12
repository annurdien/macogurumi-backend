import { Schema } from 'dynamoose';

export const HighlightSchema = new Schema({
    project: {
        type: String,
        hashKey: true,
        default: 'kagibari'
    },
    illustrationUrl: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: Object,
        schema: {
            category: { type: String, required: true },
            texts: { type: Array, schema: [String], required: false },
            images: { type: Array, schema: [String], required: false },
            videos: { type: Array, schema: [String], required: false },
        }
    },
    author: {
        type: Object,
        schema: {
            name: { type: String, required: true },
            socialMediaAccount: { type: String, required: true },
            socialMediaIcon: { type: String, required: true },
            socialMediaUrl: { type: String, required: true },
        }
    },
    timestamp: {
        type: Number,
        rangeKey: true,
    },
    updatedAt: {
        type: Number,
    }
});
