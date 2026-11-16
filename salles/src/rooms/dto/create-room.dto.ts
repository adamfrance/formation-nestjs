import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { EQUIPMENTS, type Equipment } from '../room.model.js';

// Ce qu'on envoie pour créer une salle
export class CreateRoomDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // le nom, sans espaces autour
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsInt()
  @Min(1)
  @Max(200)
  capacity: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique() // pas deux fois le même équipement
  @IsIn(EQUIPMENTS, { each: true }) // each : la règle s'applique à chaque élément du tableau
  equipments?: Equipment[];
}
