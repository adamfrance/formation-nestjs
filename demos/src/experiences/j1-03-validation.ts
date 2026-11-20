// Expérience : ce que fait ValidationPipe à chaque requête, avec trois outils de plus
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { plainToInstance, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, validate } from 'class-validator';

const nettoyer = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value); // retire les espaces autour d'un texte

class InscriptionDto {
  @Transform(nettoyer) // appliqué avant la vérification
  @IsString()
  @IsNotEmpty()
  nom: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)) // sans espaces, en minuscules
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  motDePasse: string;

  @IsOptional()
  @IsString()
  entreprise?: string;

  @ValidateIf((o: InscriptionDto) => o.entreprise !== undefined) // vérifié seulement pour une entreprise
  @IsNotEmpty({ message: 'Le numéro de TVA est obligatoire pour une entreprise' })
  numeroTva?: string;
}

class ProfilDto extends PartialType(OmitType(InscriptionDto, ['motDePasse'] as const)) {} // sans mot de passe, tout facultatif
class MotDePasseDto extends PickType(InscriptionDto, ['motDePasse'] as const) {} // le mot de passe seul

// Ce que fait ValidationPipe : le JSON reçu devient une instance de la classe, puis on la vérifie
async function verifier(cas: string, classe: new () => object, corps: object) {
  const instance = plainToInstance(classe, corps); // les @Transform s'appliquent ici
  const erreurs = await validate(instance, { whitelist: true, forbidNonWhitelisted: true }); // les règles des décorateurs
  const resultat = erreurs.map((e) => `${e.property} : ${Object.values(e.constraints ?? {}).join(' ; ')}`);
  console.log(`${cas} →`, erreurs.length ? resultat : instance);
}

await verifier('inscription', InscriptionDto, { nom: '  Léa  ', email: ' Lea.Martin@Example.COM ', motDePasse: 'motdepasse' });
await verifier('entreprise', InscriptionDto, { nom: 'Léa', email: 'lea@example.com', motDePasse: 'motdepasse', entreprise: 'Orisha' });
await verifier('profil', ProfilDto, { nom: 'Léa Martin' });
await verifier('profil, mot de passe', ProfilDto, { motDePasse: 'nouveau-secret' });
await verifier('profil, entreprise', ProfilDto, { entreprise: 'Orisha' });
await verifier('mot de passe', MotDePasseDto, { motDePasse: 'court' });
