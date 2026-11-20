import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TrajetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const logger = new Logger('Trajet');
    logger.log('3. intercepteur, avant la méthode');
    return next.handle().pipe(tap(() => logger.log('6. intercepteur, après la méthode')));
  }
}
