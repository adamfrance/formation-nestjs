import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import type { Booking } from './booking.model.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Controller('rooms/:roomId/bookings') // les réservations sont rangées sous leur salle
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: "Les réservations d'une salle, dans l'ordre des créneaux" })
  @ApiNotFoundResponse({ description: 'Salle introuvable' })
  findAll(@Param('roomId', ParseUUIDPipe) roomId: string): Booking[] {
    return this.bookingsService.findAll(roomId);
  }

  @Post()
  @ApiOperation({ summary: 'Réserver une salle' })
  @ApiBadRequestResponse({ description: 'Données invalides, créneau dans le passé ou trop long, salle trop petite' })
  @ApiNotFoundResponse({ description: 'Salle introuvable' })
  @ApiConflictResponse({ description: 'Créneau déjà pris' }) // 409 : en conflit avec une autre réservation
  create(@Param('roomId', ParseUUIDPipe) roomId: string, @Body() dto: CreateBookingDto): Booking {
    return this.bookingsService.create(roomId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiNotFoundResponse({ description: 'Réservation introuvable' })
  remove(@Param('roomId', ParseUUIDPipe) roomId: string, @Param('id', ParseUUIDPipe) id: string): void {
    this.bookingsService.remove(roomId, id);
  }
}
