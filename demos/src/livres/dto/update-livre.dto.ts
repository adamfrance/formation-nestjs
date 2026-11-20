import { PartialType } from '@nestjs/mapped-types';
import { CreateLivreDto } from './create-livre.dto.js';

// Tous les champs de CreateLivreDto, avec leurs règles, devenus facultatifs
export class UpdateLivreDto extends PartialType(CreateLivreDto) {}
