export interface HighlightKey {
    project: string;
    timestamp: number;
}

export interface Highlight extends HighlightKey {
    illustrationUrl: string;
    title: string;
    content: string;
    author: string;
    socialMediaIcon: string;
    socialMediaUrl: string;
}