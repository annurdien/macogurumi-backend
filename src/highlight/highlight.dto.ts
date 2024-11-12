import { IsNotEmpty, isNumber, isObject, IsObject, IsString } from 'class-validator';
import { Author, Content } from './highlight.interface';

export class CreateHighlightDto {
    @IsNotEmpty()
    @IsString()
    illustrationUrl: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsObject()
    content: Content;

    @IsNotEmpty()
    @IsObject()
    author: Author;
}

export class UpdateHighlightDto {
    @IsString()
    illustrationUrl?: string;

    @IsString()
    title?: string;

    @IsObject()
    content?: Content;

    @IsObject()
    author?: Author;
}

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}
