import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

// Écrit une ligne par requête réussie : méthode, adresse, statut, durée, identifiant
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp(); // la requête et la réponse d'Express
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const debut = Date.now(); // avant la méthode du contrôleur

    return next.handle().pipe(
      // après la méthode du contrôleur, quand la réponse est prête
      tap(() => {
        const duree = Date.now() - debut;
        this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duree} ms [${req.header('x-request-id')}]`);
      }),
    );
  }
}
