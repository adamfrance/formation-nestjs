import type { NextFunction, Request, Response } from 'express';

// Un middleware fonction : pas de classe ni d'injection, assez pour un traitement simple
export function journal(req: Request, res: Response, next: NextFunction) {
  const debut = Date.now();
  res.on('finish', () => {
    console.log(`[journal] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - debut} ms`); // réponse partie
  });
  next();
}
