import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  StandardSchemaValidationPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Livre } from './livre.entity.js';
import { LivresService } from './livres.service.js';
import { EmpruntsService } from './emprunts.service.js';
import { CreateLivreDto } from './dto/create-livre.dto.js';
import { UpdateLivreDto } from './dto/update-livre.dto.js';
import { CreateEmpruntDto } from './dto/create-emprunt.dto.js';
import { suggestionSchema } from './suggestion.schema.js';
import type { Suggestion } from './suggestion.schema.js';
import { LivreParIdPipe } from './livre-par-id.pipe.js';
import { CleApiGuard } from './cle-api.guard.js';
import { DureeInterceptor } from '../commun/duree.interceptor.js';
import { EnveloppeInterceptor } from '../commun/enveloppe.interceptor.js';
import { DelaiInterceptor } from '../commun/delai.interceptor.js';

@Controller('livres')
@UseInterceptors(DureeInterceptor) // sur toutes les routes du contrôleur
export class LivresController {
  constructor(
    private readonly livresService: LivresService,
    private readonly empruntsService: EmpruntsService,
  ) {}

  // GET /api/livres?limite=2 : sans limite, 10 ; piège : ?limite=deux donne aussi 10, sans erreur
  @Get()
  findAll(
    @Query('limite', new DefaultValuePipe(10), ParseIntPipe) limite: number,
    @Query('auteur') auteur?: string,
  ): Promise<Livre[]> {
    return this.livresService.findAll(auteur).then((livres) => livres.slice(0, limite));
  }

  @Get('disponibles')
  @UseInterceptors(EnveloppeInterceptor) // sur cette route seulement
  disponibles(): Promise<Livre[]> {
    return this.livresService.disponibles();
  }

  // GET /api/livres/panne : une erreur imprévue, qui n'est pas une exception HTTP
  @Get('panne')
  panne(): never {
    throw new Error('connexion à la base perdue');
  }

  // GET /api/livres/lent : une réponse qui met 3 secondes, coupée à 2 par DelaiInterceptor
  @Get('lent')
  @UseInterceptors(DelaiInterceptor)
  async lent(): Promise<string> {
    await new Promise((fin) => setTimeout(fin, 3000));
    return 'enfin';
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Livre> {
    return this.livresService.findOne(id); // id est déjà un nombre
  }

  // Deux pipes à la suite : ParseIntPipe donne un nombre, LivreParIdPipe en fait un livre
  @Get(':id/fiche')
  fiche(@Param('id', ParseIntPipe, LivreParIdPipe) livre: Livre) {
    return { fiche: `${livre.titre}, de ${livre.auteur} (${livre.annee})` };
  }

  @Post()
  @UseGuards(CleApiGuard) // les écritures demandent la clé d'API
  create(@Body() dto: CreateLivreDto): Promise<Livre> {
    return this.livresService.create(dto);
  }

  @Post(':id/emprunt') // POST /api/livres/1/emprunt
  @UseInterceptors(ClassSerializerInterceptor) // applique @Exclude() à la réponse
  emprunter(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateEmpruntDto) {
    return this.empruntsService.emprunter(id, dto.lecteur);
  }

  // NestJS 12 : un corps vérifié par un schéma Zod (Standard Schema), sans classe DTO
  @Post('suggestions')
  suggerer(@Body({ schema: suggestionSchema, pipes: [StandardSchemaValidationPipe] }) suggestion: Suggestion) {
    return { recue: suggestion };
  }

  @Patch(':id')
  @UseGuards(CleApiGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLivreDto): Promise<Livre> {
    return this.livresService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(CleApiGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.livresService.remove(id);
  }
}
