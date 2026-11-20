import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

// Toutes les erreurs repartent au même format JSON ; les erreurs inattendues (500) sont écrites dans le journal
@Catch() // sans argument : attrape toutes les exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const reponse = exception instanceof HttpException ? exception.getResponse() : 'Erreur interne du serveur';
    const message = typeof reponse === 'string' ? reponse : (reponse as { message: string | string[] }).message;

    if (status >= 500) {
      this.logger.error(`${req.method} ${req.originalUrl}`, exception instanceof Error ? exception.stack : exception);
    } else {
      this.logger.warn(`${req.method} ${req.originalUrl} ${status} [${req.header('x-request-id')}]`);
    }

    res.status(status).json({
      statusCode: status,
      message, // jamais la pile d'appels : elle reste dans le journal du serveur
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      requestId: req.header('x-request-id'),
    });
  }
}
