import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Enrollment } from './enrollment.entity.js';
import { EnrollmentsService } from './enrollments.service.js';

@Controller() // les adresses sont écrites en entier dans chaque route
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:courseId/enroll') // POST /api/courses/:courseId/enroll : tout compte connecté
  enroll(@Param('courseId', ParseUUIDPipe) courseId: string, @CurrentUser() user: AuthUser): Promise<Enrollment> {
    return this.enrollmentsService.enroll(courseId, user);
  }

  @Get('me/enrollments') // GET /api/me/enrollments : mes inscriptions
  findMine(@CurrentUser() user: AuthUser): Promise<Enrollment[]> {
    return this.enrollmentsService.findMine(user);
  }
}
