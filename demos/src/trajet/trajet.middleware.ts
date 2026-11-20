import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class TrajetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    new Logger('Trajet').log(`1. middleware : ${req.method} ${req.originalUrl}`);
    next();
  }
}
