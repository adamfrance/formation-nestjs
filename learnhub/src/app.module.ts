import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { LessonsModule } from './lessons/lessons.module.js';

@Module({
  imports: [CoursesModule, LessonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
