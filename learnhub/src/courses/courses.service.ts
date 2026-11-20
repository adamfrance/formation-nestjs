import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Page } from '../common/page.js';
import type { Course } from './course.model.js';
import { COURSES_SEED } from './courses.seed.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly logger = new Logger(CoursesService.name); // les messages portent le nom du service
  private readonly courses: Course[] = [];

  constructor(@Inject(COURSES_SEED) private readonly seed: Omit<Course, 'id'>[]) {} // injecté par son jeton

  // Appelé par Nest une fois le module prêt, avant la première requête
  onModuleInit() {
    for (const data of this.seed) {
      this.courses.push({ id: randomUUID(), ...data });
    }
    this.logger.log(`Catalogue de départ chargé : ${this.courses.length} cours`);
  }

  findAll({ page, limit, search }: QueryCoursesDto): Page<Course> {
    const term = search?.toLowerCase();
    const found = term ? this.courses.filter((c) => c.title.toLowerCase().includes(term)) : this.courses;
    const start = (page - 1) * limit; // page 2 de 10 : on saute les 10 premiers
    return { data: found.slice(start, start + limit), total: found.length, page, limit };
  }

  findOne(id: string): Course {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Cours ${id} introuvable`);
    }
    return course;
  }

  create(dto: CreateCourseDto): Course {
    const course: Course = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description ?? '', // ?? : la valeur par défaut si le champ est absent
      priceCents: dto.priceCents ?? 0,
      published: dto.published ?? false,
    };
    this.courses.push(course);
    return course;
  }

  update(id: string, dto: UpdateCourseDto): Course {
    const course = this.findOne(id);
    Object.assign(course, dto);
    return course;
  }

  remove(id: string): void {
    const course = this.findOne(id);
    this.courses.splice(this.courses.indexOf(course), 1);
  }
}
