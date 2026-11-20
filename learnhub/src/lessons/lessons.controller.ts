import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../users/role.enum.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { Lesson } from './lesson.entity.js';
import { LessonsService } from './lessons.service.js';

@Controller('courses/:courseId/lessons') // les leçons sont rangées sous leur cours
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Public()
  @Get()
  findAll(@Param('courseId', ParseUUIDPipe) courseId: string): Promise<Lesson[]> {
    return this.lessonsService.findAll(courseId);
  }

  @Post()
  @Roles(Role.Teacher, Role.Admin)
  create(@Param('courseId', ParseUUIDPipe) courseId: string, @Body() dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(courseId, dto);
  }
}
