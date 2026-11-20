import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TrajetController } from './trajet.controller.js';
import { TrajetMiddleware } from './trajet.middleware.js';

@Module({ controllers: [TrajetController] })
export class TrajetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrajetMiddleware).forRoutes(TrajetController); // le middleware, sur les routes de ce contrôleur
  }
}
