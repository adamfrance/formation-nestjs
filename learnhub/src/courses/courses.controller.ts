import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import type { Course } from './course.model.js';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {} // Nest fournit le service : l'injection

  @Get()
  @ApiOperation({ summary: 'Lister les cours, filtrés par ?search=' }) // le résumé affiché dans Swagger UI
  findAll(@Query('search') search?: string): Course[] {
    return this.coursesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lire un cours' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' }) // le 404 que lance le service
  findOne(@Param('id') id: string): Course {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un cours' })
  @ApiBadRequestResponse({ description: 'Données invalides' }) // le 400 de ValidationPipe
  create(@Body() dto: CreateCourseDto): Course {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier les champs envoyés' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto): Course {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un cours' })
  @ApiNotFoundResponse({ description: 'Cours introuvable' })
  remove(@Param('id') id: string): void {
    this.coursesService.remove(id);
  }
}
