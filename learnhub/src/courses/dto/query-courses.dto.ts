import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// Les paramètres d'adresse de GET /api/courses : ?page=2&limit=5&search=nest
export class QueryCoursesDto {
  @IsOptional()
  @Type(() => Number) // un paramètre d'adresse arrive en texte : "2" devient 2
  @IsInt()
  @Min(1)
  page: number = 1; // la valeur par défaut, si le paramètre manque

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50) // jamais plus de 50 cours par page
  limit: number = 10;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  search?: string;
}
