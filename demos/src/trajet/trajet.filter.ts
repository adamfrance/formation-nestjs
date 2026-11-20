import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class TrajetFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    new Logger('Trajet').log(`filtre : « ${exception.message} » devient une réponse ${exception.getStatus()}`);
    host.switchToHttp().getResponse<Response>().status(exception.getStatus()).json({ erreur: exception.message });
  }
}
