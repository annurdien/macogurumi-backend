export interface HighlightKey {
    project: string;
    timestamp: number;
}

export interface Highlight extends HighlightKey {
    illustrationUrl: string;
    title: string;
    content: Content;
    author: Author;
}

export interface Content {
    category: string;
    texts?: string[];
    images?: string[];
    videos?: string[];
}

export interface Author {
    name: string;
    socialMediaAccount: string;
    socialMediaIcon: string;
    socialMediaUrl: string;
}