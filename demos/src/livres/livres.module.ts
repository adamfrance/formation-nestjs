import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livre } from './livre.entity.js';
import type { ConfigType } from '@nestjs/config';
import mediathequeConfig from '../config/mediatheque.config.js';
import { LivresController } from './livres.controller.js';
import { LivresService } from './livres.service.js';
import { EmpruntsService } from './emprunts.service.js';
import { DUREE_PRET_JOURS, HORLOGE } from './livres.tokens.js';
import type { Horloge } from './livres.tokens.js';
import { journal } from './journal.middleware.js';

@Module({
  imports: [TypeOrmModule.forFeature([Livre])], // le repository de Livre, pour ce module
  controllers: [LivresController],
  providers: [
    LivresService, // raccourci de { provide: LivresService, useClass: LivresService }
    EmpruntsService,
    {
      provide: DUREE_PRET_JOURS,
      inject: [mediathequeConfig.KEY], // la fabrique reçoit les réglages
      useFactory: (config: ConfigType<typeof mediathequeConfig>) => config.dureePretJours,
    },
    { provide: HORLOGE, useFactory: (): Horloge => ({ maintenant: () => new Date() }) }, // useFactory : fabriquée au démarrage
  ],
})
export class LivresModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(journal).forRoutes(LivresController); // seulement les routes des livres
  }
}
