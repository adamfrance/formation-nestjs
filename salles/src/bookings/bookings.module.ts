import { Module } from '@nestjs/common';
import { RoomsModule } from '../rooms/rooms.module.js';
import { BookingsController } from './bookings.controller.js';
import { BOOKING_RULES, CLOCK, type BookingRules, type Clock } from './bookings.constants.js';
import { BookingsService } from './bookings.service.js';
import { AvailabilityController } from './availability.controller.js';

@Module({
  imports: [RoomsModule], // pour recevoir RoomsService
  controllers: [BookingsController, AvailabilityController],
  providers: [
    BookingsService,
    { provide: CLOCK, useFactory: (): Clock => ({ now: () => new Date() }) }, // l'horloge réelle, fabriquée au démarrage
    { provide: BOOKING_RULES, useValue: { maxMinutes: 240 } satisfies BookingRules }, // 4 heures au plus
  ],
})
export class BookingsModule {}
