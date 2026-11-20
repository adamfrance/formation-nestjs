import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { LessonsModule } from './lessons/lessons.module.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { validate } from './config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }), // lit .env, vérifie, et partage ConfigService partout
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // la connexion se construit avec la configuration validée
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true, // les entités déclarées par forFeature() dans les modules
        synchronize: false, // les tables viennent désormais des migrations
      }),
    }),
    CoursesModule,
    LessonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}'); // toutes les routes (syntaxe d'Express 5)
  }
}
