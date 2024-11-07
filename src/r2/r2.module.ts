import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { R2Service } from './r2.service';
import { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } from '../shared/configs/r2.config';

@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: 'auto',
          endpoint: R2_ENDPOINT,
          credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
          },
        });
      },
    },
    R2Service,
  ],
  exports: [R2Service],
})
export class R2Module { }