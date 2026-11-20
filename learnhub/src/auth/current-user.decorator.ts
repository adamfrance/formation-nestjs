import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from './auth-user.interface.js';

// @CurrentUser() : donne à la méthode le contenu du jeton, rangé dans la requête par le guard JWT
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthUser => {
  const req = context.switchToHttp().getRequest<Request & { user: AuthUser }>();
  return req.user;
});
