import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { LoggingInterceptor } from './common/logging.interceptor.js';

// Les réglages de l'application, partagés par main.ts et par les tests de bout en bout
export function configureApp(app: INestApplication) {
  app.use(helmet()); // des en-têtes de sécurité sur chaque réponse
  app.enableCors({ origin: ['http://localhost:5173'] }); // seule l'application web de l'entreprise peut appeler l'API depuis un navigateur
  app.setGlobalPrefix('api'); // toutes les routes commencent par /api
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // retire les champs que le DTO ne connaît pas
      forbidNonWhitelisted: true, // et refuse la requête s'il y en a
      transform: true, // fournit au contrôleur une instance du DTO
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor()); // sur toutes les routes
  app.useGlobalFilters(new AllExceptionsFilter()); // toutes les erreurs passent par ce filtre
}
