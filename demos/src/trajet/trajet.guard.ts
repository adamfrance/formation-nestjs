import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TrajetGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    new Logger('Trajet').log(`2. guard : ${context.getClass().name}.${context.getHandler().name} autorisé`);
    return true; // false : la requête s'arrête ici, 403
  }
}
