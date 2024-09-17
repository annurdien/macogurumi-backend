import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { env } from '~shared/configs/env.config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    
    if (this.validateApiKey(apiKey)) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }

  private validateApiKey(apiKey: string | string[] | undefined): boolean {
    const validApiKey = env.API.KEY;
    return apiKey === validApiKey;
  }
}
