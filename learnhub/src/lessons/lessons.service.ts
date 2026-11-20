import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesService } from '../courses/courses.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { Lesson } from './lesson.entity.js';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    private readonly coursesService: CoursesService,
  ) {}

  async findAll(courseId: string): Promise<Lesson[]> {
    await this.coursesService.findOne(courseId); // 404 si le cours n'existe pas
    return this.lessons.find({ where: { courseId }, order: { position: 'ASC' } });
  }

  async create(courseId: string, dto: CreateLessonDto): Promise<Lesson> {
    await this.coursesService.findOne(courseId);
    const count = await this.lessons.countBy({ courseId }); // SELECT COUNT(*) … WHERE "courseId" = …
    const lesson = this.lessons.create({ title: dto.title, content: dto.content, courseId, position: count + 1 });
    return this.lessons.save(lesson);
  }
}
