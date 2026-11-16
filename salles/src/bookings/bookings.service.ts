import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Room } from '../rooms/room.model.js';
import { RoomsService } from '../rooms/rooms.service.js';
import type { Booking } from './booking.model.js';
import { BOOKING_RULES, CLOCK, type BookingRules, type Clock } from './bookings.constants.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    private readonly roomsService: RoomsService, // exporté par RoomsModule
    @Inject(CLOCK) private readonly clock: Clock, // l'horloge, par son jeton
    @Inject(BOOKING_RULES) private readonly rules: BookingRules, // les règles, par leur jeton
  ) {}

  findAll(roomId: string): Booking[] {
    this.roomsService.findOne(roomId); // 404 si la salle n'existe pas
    return this.bookings
      .filter((b) => b.roomId === roomId)
      .toSorted((a, b) => Date.parse(a.start) - Date.parse(b.start)); // dans l'ordre des créneaux
  }

  // Les règles qui dépendent de la salle, de l'heure et des autres réservations : dans le service, pas dans le DTO
  create(roomId: string, dto: CreateBookingDto): Booking {
    const room = this.roomsService.findOne(roomId);
    const start = Date.parse(dto.start); // en millisecondes depuis 1970 : se compare avec < et >
    const end = Date.parse(dto.end);
    if (end <= start) {
      throw new BadRequestException('La fin doit suivre le début');
    }
    if ((end - start) / 60_000 > this.rules.maxMinutes) {
      throw new BadRequestException(`Une réservation dure ${this.rules.maxMinutes} minutes au plus`);
    }
    if (start < this.clock.now().getTime()) {
      throw new BadRequestException('Impossible de réserver dans le passé');
    }
    if (dto.attendees > room.capacity) {
      throw new BadRequestException(`La salle ${room.name} accueille ${room.capacity} personnes au plus`);
    }
    const overlap = this.findOverlap(roomId, start, end);
    if (overlap) {
      throw new ConflictException(`Créneau déjà pris par « ${overlap.title} »`); // 409
    }
    const booking: Booking = { id: randomUUID(), roomId, title: dto.title, start: dto.start, end: dto.end, attendees: dto.attendees };
    this.bookings.push(booking);
    return booking;
  }

  remove(roomId: string, id: string): void {
    const booking = this.bookings.find((b) => b.id === id && b.roomId === roomId); // la réservation, dans cette salle
    if (!booking) {
      throw new NotFoundException(`Réservation ${id} introuvable`);
    }
    this.bookings.splice(this.bookings.indexOf(booking), 1);
  }

  // Les salles assez grandes et libres sur tout le créneau
  freeRooms(start: string, end: string, attendees: number): Room[] {
    const from = Date.parse(start); // NaN si ce n'est pas une date
    const to = Date.parse(end);
    if (Number.isNaN(from) || Number.isNaN(to) || to <= from || !Number.isInteger(attendees) || attendees < 1) {
      throw new BadRequestException("Attendus : start et end, deux dates ISO 8601 dans l'ordre, et attendees, un entier positif");
    }
    return this.roomsService.findAll().filter((room) => room.capacity >= attendees && !this.findOverlap(room.id, from, to));
  }

  // Deux créneaux se chevauchent si chacun commence avant la fin de l'autre
  private findOverlap(roomId: string, start: number, end: number): Booking | undefined {
    return this.bookings.find((b) => b.roomId === roomId && start < Date.parse(b.end) && end > Date.parse(b.start));
  }
}
