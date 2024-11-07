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
        type: String
    },
    author: {
        type: String
    },
    socialMediaIcon: {
        type: String
    },
    sociaMediaUrl: {
        type: String
    },
    timestamp: {
        type: Number,
        rangeKey: true,
    },
    updatedAt: {
        type: Number,
    }
}
);