import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthUser } from './auth-user.interface.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';

// Branché sur toute l'application : chaque route demande un jeton valide, sauf celles marquées @Public()
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector, // lit les étiquettes posées par les décorateurs
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // l'étiquette sur la méthode…
      context.getClass(), // … ou sur le contrôleur
    ]);
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const [type, token] = req.headers.authorization?.split(' ') ?? []; // « Bearer <jeton> »
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Jeton manquant');
    }
    try {
      req.user = await this.jwtService.verifyAsync<AuthUser>(token); // signature et date d'expiration vérifiées
    } catch {
      throw new UnauthorizedException('Jeton invalide ou expiré');
    }
    return true;
  }
}
