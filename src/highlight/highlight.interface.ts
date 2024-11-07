export interface HighlightKey {
    project: string;
    timestamp: Number;
}

export interface Highlight extends HighlightKey {
    illustrationUrl: string;
    title: string;
    content: string;
    author: string;
    socialMediaIcon: string;
    sociaMediaUrl: string;
}