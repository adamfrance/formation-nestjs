import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity.js';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { COURSES_SEED, SEED_COURSES } from './courses.seed.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]), // fournit le repository de Course à ce module
    CacheModule.register({ ttl: 30_000 }), // un cache en mémoire : chaque entrée vit 30 secondes
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    { provide: COURSES_SEED, useValue: SEED_COURSES }, // un provider personnalisé : une valeur rangée sous un jeton
  ],
  exports: [CoursesService], // utilisable par les modules qui importent CoursesModule
})
export class CoursesModule {}
