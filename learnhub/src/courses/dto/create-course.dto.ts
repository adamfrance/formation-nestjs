import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

// Retire les espaces autour d'un texte ; une autre valeur passe telle quelle, et les règles la jugeront
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

// Ce qu'un client a le droit d'envoyer pour créer un cours, et les règles que chaque champ doit respecter
export class CreateCourseDto {
  @Transform(trim) // appliqué avant les règles : un titre fait d'espaces devient vide, donc refusé
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsOptional() // champ facultatif : les autres règles ne s'appliquent que s'il est présent
  @Transform(trim)
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
