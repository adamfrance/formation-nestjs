import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class LecteurDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsEmail({}, { message: 'L’adresse e-mail du lecteur est invalide' })
  email: string;
}

// Un DTO qui en contient un autre : ValidateNested descend dans l'objet, Type dit en quelle classe le transformer
export class CreateEmpruntDto {
  @ValidateNested()
  @Type(() => LecteurDto)
  lecteur: LecteurDto;
}
