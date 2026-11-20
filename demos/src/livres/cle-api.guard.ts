import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Request } from 'express';
import mediathequeConfig from '../config/mediatheque.config.js';

// Seules les requêtes qui présentent la bonne clé d'API passent ; les autres reçoivent 401
@Injectable()
export class CleApiGuard implements CanActivate {
  constructor(
    @Inject(mediathequeConfig.KEY) private readonly config: ConfigType<typeof mediathequeConfig>, // réglages typés
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.header('x-api-key') !== this.config.cleApi) {
      throw new UnauthorizedException('Clé d’API absente ou fausse');
    }
    return true;
  }
}
