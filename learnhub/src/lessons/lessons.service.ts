import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CoursesService } from '../courses/courses.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import type { Lesson } from './lesson.model.js';

@Injectable()
export class LessonsService {
  private readonly lessons: Lesson[] = [];

  constructor(private readonly coursesService: CoursesService) {} // un service d'un autre module

  findAll(courseId: string): Lesson[] {
    this.coursesService.findOne(courseId); // 404 si le cours n'existe pas
    return this.lessons.filter((l) => l.courseId === courseId);
  }

  create(courseId: string, dto: CreateLessonDto): Lesson {
    this.coursesService.findOne(courseId);
    const lesson: Lesson = {
      id: randomUUID(),
      courseId,
      title: dto.title,
      content: dto.content ?? '',
      position: this.findAll(courseId).length + 1, // à la suite des leçons existantes
    };
    this.lessons.push(lesson);
    return lesson;
  }
}
