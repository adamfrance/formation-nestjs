import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto.js';

// Les champs et les règles de la création, tous facultatifs
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
