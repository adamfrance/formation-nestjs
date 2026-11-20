import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

// map() remplace la réponse : la valeur renvoyée par la méthode, rangée dans une enveloppe
@Injectable()
export class EnveloppeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((donnees: unknown) => ({ donnees, servieLe: new Date().toISOString() })));
  }
}
