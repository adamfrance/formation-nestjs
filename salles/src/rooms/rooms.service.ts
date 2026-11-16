import { ConflictException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Room } from './room.model.js';
import { ROOMS_SEED } from './rooms.seed.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Injectable()
export class RoomsService implements OnModuleInit {
  private readonly logger = new Logger(RoomsService.name); // les messages portent le nom du service
  private readonly rooms: Room[] = [];

  constructor(@Inject(ROOMS_SEED) private readonly seed: Omit<Room, 'id'>[]) {} // les salles de départ, par leur jeton

  // Appelé par Nest une fois le module prêt, avant la première requête
  onModuleInit() {
    for (const data of this.seed) {
      this.rooms.push({ id: randomUUID(), ...data }); // chaque salle reçoit son identifiant
    }
    this.logger.log(`${this.rooms.length} salles chargées`);
  }

  findAll(): Room[] {
    return this.rooms;
  }

  findOne(id: string): Room {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) {
      throw new NotFoundException(`Salle ${id} introuvable`); // 404
    }
    return room;
  }

  create(dto: CreateRoomDto): Room {
    this.assertNameFree(dto.name); // 409 si le nom est pris
    const room: Room = { id: randomUUID(), name: dto.name, capacity: dto.capacity, equipments: dto.equipments ?? [] };
    this.rooms.push(room);
    return room;
  }

  update(id: string, dto: UpdateRoomDto): Room {
    const room = this.findOne(id); // 404 si la salle n'existe pas
    if (dto.name !== undefined) {
      this.assertNameFree(dto.name, id); // un nouveau nom ne doit pas être pris par une autre salle
    }
    Object.assign(room, dto); // seuls les champs envoyés changent
    return room;
  }

  remove(id: string): void {
    const room = this.findOne(id);
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }

  // Deux salles ne portent pas le même nom, sans tenir compte des majuscules : 409 sinon
  private assertNameFree(name: string, exceptId?: string): void {
    const taken = this.rooms.some((r) => r.id !== exceptId && r.name.toLowerCase() === name.toLowerCase());
    if (taken) {
      throw new ConflictException(`Une salle s'appelle déjà « ${name} »`);
    }
  }
}
