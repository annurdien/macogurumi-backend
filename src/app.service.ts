import { Injectable, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 'active',
      message: 'Hello, from macogurumi!',
    };
  }
}
