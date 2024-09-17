import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 'active',
      message: 'Hello, from macogurumi!'
    };
  }
}
