import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import type { Page } from '../common/page.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { Course } from './course.entity.js';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {} // Nest fournit le service : l'injection

  @Get()
  @UseInterceptors(CacheInterceptor) // la réponse est gardée 30 s, par adresse (page, recherche…)
  @ApiOperation({ summary: 'Lister les cours, filtrés par ?search=' }) // le résumé affiché dans Swagger UI
  findAll(@Query() query: QueryCoursesDto): Promise<Page<Course>> {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lire un cours' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' }) // le 404 que lance le service
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.findDetail(id); // avec ses leçons
  }

  @Post()
  @ApiOperation({ summary: 'Créer un cours' })
  @ApiBadRequestResponse({ description: 'Données invalides' }) // le 400 de ValidationPipe
  create(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier les champs envoyés' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un cours' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.remove(id);
  }
}
