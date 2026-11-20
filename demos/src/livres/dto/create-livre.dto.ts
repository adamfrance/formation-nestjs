import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateLivreDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' }) // un message en français, à la place du message anglais
  titre: string;

  @IsString()
  @IsNotEmpty()
  auteur: string;

  @IsInt()
  @Min(1450) // l'imprimerie
  @Max(2100)
  annee: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}
