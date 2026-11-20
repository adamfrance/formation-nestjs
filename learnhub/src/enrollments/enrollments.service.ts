import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthUser } from '../auth/auth-user.interface.js';
import { CoursesService } from '../courses/courses.service.js';
import { Enrollment } from './enrollment.entity.js';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    private readonly coursesService: CoursesService,
  ) {}

  async enroll(courseId: string, user: AuthUser): Promise<Enrollment> {
    const course = await this.coursesService.findOne(courseId); // 404 si le cours n'existe pas
    if (!course.published) {
      throw new BadRequestException('Ce cours n’est pas encore publié');
    }
    if (await this.enrollments.existsBy({ courseId, studentId: user.sub })) {
      throw new ConflictException('Vous êtes déjà inscrit à ce cours');
    }
    return this.enrollments.save(this.enrollments.create({ courseId, studentId: user.sub }));
  }

  // Les inscriptions du compte connecté, avec leur cours : une seule requête (LEFT JOIN)
  findMine(user: AuthUser): Promise<Enrollment[]> {
    return this.enrollments.find({
      where: { studentId: user.sub },
      relations: { course: true },
      order: { enrolledAt: 'DESC' },
    });
  }
}
