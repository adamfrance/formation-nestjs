import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

// Donne un identifiant à chaque requête : on le retrouve dans la réponse et dans les journaux
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.header('x-request-id') ?? randomUUID(); // repris de la requête s'il existe, sinon créé
    req.headers['x-request-id'] = id; // lisible par la suite du trajet
    res.setHeader('X-Request-Id', id); // renvoyé au client
    next(); // passe la main à l'étape suivante
  }
}
