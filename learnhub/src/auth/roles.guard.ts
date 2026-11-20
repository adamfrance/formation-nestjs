import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../users/role.enum.js';
import type { AuthUser } from './auth-user.interface.js';
import { ROLES_KEY } from './roles.decorator.js';

// Après le guard JWT : la route demande-t-elle un rôle, et le compte connecté l'a-t-il ?
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true; // pas de @Roles : tout compte connecté passe
    }
    const { user } = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Votre rôle ne permet pas cette action'); // 403 : connecté, mais pas autorisé
    }
    return true;
  }
}
