import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

// Ce qu'on envoie pour réserver une salle
export class CreateBookingDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // l'objet de la réunion, sans espaces autour
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;

  @IsISO8601({ strict: true }) // strict : une date qui n'existe pas (le 31 novembre) est refusée
  start: string;

  @IsISO8601({ strict: true })
  end: string;

  @IsInt()
  @Min(1)
  attendees: number;
}
