import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;
}
