import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import type { Room } from '../rooms/room.model.js';
import { BookingsService } from './bookings.service.js';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly bookingsService: BookingsService) {}

  // GET /api/availability?start=…&end=…&attendees=6 : les paramètres d'adresse arrivent en texte
  @Get()
  @ApiOperation({ summary: 'Les salles libres sur un créneau, assez grandes pour le groupe' })
  @ApiBadRequestResponse({ description: 'Créneau ou nombre de participants invalide' })
  find(@Query('start') start: string, @Query('end') end: string, @Query('attendees') attendees = '1'): Room[] {
    return this.bookingsService.freeRooms(start, end, Number(attendees)); // Number : le texte devient un nombre
  }
}
