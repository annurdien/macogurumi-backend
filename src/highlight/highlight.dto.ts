import { IsNotEmpty, isNumber, IsString } from 'class-validator';

export class CreateHighlightDto {
    @IsNotEmpty()
    @IsString()
    illustrationUrl: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    socialMediaIcon: string;

    @IsNotEmpty()
    @IsString()
    sociaMediaUrl: string;
}

export class UpdateHighlightDto {
    @IsString()
    illustrationUrl?: string;

    @IsString()
    title?: string;

    @IsString()
    content?: string;

    @IsString()
    author?: string;

    @IsString()
    socialMediaIcon?: string;

    @IsString()
    sociaMediaUrl?: string;
}

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}
