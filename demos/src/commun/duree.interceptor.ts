import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Response } from 'express';
import { Observable, tap } from 'rxjs';

// Avant et après la méthode : la durée de traitement, renvoyée dans un en-tête
@Injectable()
export class DureeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const debut = performance.now(); // avant
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => res.setHeader('X-Duree-Ms', (performance.now() - debut).toFixed(1))), // après
    );
  }
}
