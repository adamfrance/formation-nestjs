import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';

// Au-delà de 2 secondes, on n'attend plus : 408 Request Timeout
@Injectable()
export class DelaiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(2000),
      catchError((erreur: unknown) =>
        throwError(() => (erreur instanceof TimeoutError ? new RequestTimeoutException('Trop long') : erreur)),
      ),
    );
  }
}
