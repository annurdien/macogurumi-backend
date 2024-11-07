import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET_NAME, R2_ENDPOINT } from '../shared/configs/r2.config';

@Injectable()
export class R2Service {
    constructor(
        @Inject(S3Client) private readonly s3Client: S3Client
    ) { }

    async uploadImage(file: Express.Multer.File, key: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;
    }
}
