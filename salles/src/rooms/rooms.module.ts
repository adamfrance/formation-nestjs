import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller.js';
import { RoomsService } from './rooms.service.js';
import { ROOMS_SEED, SEED_ROOMS } from './rooms.seed.js';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    { provide: ROOMS_SEED, useValue: SEED_ROOMS }, // les salles de départ, rangées sous leur jeton
  ],
  exports: [RoomsService], // les réservations s'en serviront
})
export class RoomsModule {}
