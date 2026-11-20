import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { COURSES_SEED, SEED_COURSES } from './courses.seed.js';

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    { provide: COURSES_SEED, useValue: SEED_COURSES }, // un provider personnalisé : une valeur rangée sous un jeton
  ],
  exports: [CoursesService], // utilisable par les modules qui importent CoursesModule
})
export class CoursesModule {}
