import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import type { Lesson } from './lesson.model.js';
import { LessonsService } from './lessons.service.js';

@Controller('courses/:courseId/lessons') // les leçons sont rangées sous leur cours
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll(@Param('courseId', ParseUUIDPipe) courseId: string): Lesson[] {
    return this.lessonsService.findAll(courseId);
  }

  @Post()
  create(@Param('courseId', ParseUUIDPipe) courseId: string, @Body() dto: CreateLessonDto): Lesson {
    return this.lessonsService.create(courseId, dto);
  }
}
