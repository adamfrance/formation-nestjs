import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { ILike, Repository } from 'typeorm';
import type { AuthUser } from '../auth/auth-user.interface.js';
import type { Page } from '../common/page.js';
import { Role } from '../users/role.enum.js';
import { Course } from './course.entity.js';
import { COURSES_SEED } from './courses.seed.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course) private readonly courses: Repository<Course>, // le repository de la table courses
    @Inject(COURSES_SEED) private readonly seed: CreateCourseDto[],
    @Inject(CACHE_MANAGER) private readonly cache: Cache, // le cache du module
  ) {}

  // Au démarrage : le catalogue de départ, seulement si la table est vide
  async onModuleInit() {
    if ((await this.courses.count()) === 0) {
      await this.courses.save(this.seed.map((data) => this.courses.create(data)));
      this.logger.log(`Catalogue de départ enregistré : ${this.seed.length} cours`);
    }
  }

  async findAll({ page, limit, search }: QueryCoursesDto): Promise<Page<Course>> {
    const [data, total] = await this.courses.findAndCount({
      where: search ? { title: ILike(`%${search}%`) } : {}, // ILike : sans tenir compte des majuscules
      order: { title: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courses.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Cours ${id} introuvable`);
    }
    return course;
  }

  // La fiche d'un cours : le cours et ses leçons, dans l'ordre, en une seule requête (LEFT JOIN)
  async findDetail(id: string): Promise<Course> {
    const course = await this.courses.findOne({
      where: { id },
      relations: { lessons: true },
      order: { lessons: { position: 'ASC' } },
    });
    if (!course) {
      throw new NotFoundException(`Cours ${id} introuvable`);
    }
    return course;
  }

  async create(dto: CreateCourseDto, user: AuthUser): Promise<Course> {
    const course = this.courses.create(dto); // un objet Course, pas encore en base
    course.teacherId = user.sub; // l'auteur : le compte connecté
    await this.courses.save(course); // INSERT : PostgreSQL complète l'id et les dates
    await this.cache.clear(); // le catalogue a changé : les listes gardées en cache sont fausses
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, user: AuthUser): Promise<Course> {
    const course = await this.findOne(id);
    this.assertCanEdit(course, user);
    this.courses.merge(course, dto); // recopie les champs envoyés
    await this.courses.save(course); // UPDATE
    await this.cache.clear();
    return course;
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const course = await this.findOne(id);
    this.assertCanEdit(course, user);
    await this.courses.remove(course); // DELETE
    await this.cache.clear();
  }

  // Le contrôle au niveau de la ressource : l'auteur du cours, ou un administrateur
  private assertCanEdit(course: Course, user: AuthUser) {
    if (user.role !== Role.Admin && course.teacherId !== user.sub) {
      throw new ForbiddenException('Seul l’auteur du cours ou un administrateur peut le modifier');
    }
  }
}
