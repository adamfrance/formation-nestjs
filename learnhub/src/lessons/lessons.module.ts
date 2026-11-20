import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module.js';
import { LessonsController } from './lessons.controller.js';
import { LessonsService } from './lessons.service.js';

@Module({
  imports: [CoursesModule], // pour recevoir CoursesService, exporté par CoursesModule
  controllers: [LessonsController],
  providers: [LessonsService]
})
export class LessonsModule {}
