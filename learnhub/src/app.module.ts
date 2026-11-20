import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { LessonsModule } from './lessons/lessons.module.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { validate } from './config/env.validation.js';
import { HealthController } from './health/health.controller.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EnrollmentsModule } from './enrollments/enrollments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', // Vitest règle NODE_ENV à test
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), // 100 requêtes par minute et par adresse IP
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
        synchronize: config.get('NODE_ENV') === 'test', // en test seulement : les tables créées d'après les entités…
        dropSchema: config.get('NODE_ENV') === 'test', // … dans une base vidée à chaque lancement
      }),
    }),
    CoursesModule,
    LessonsModule,
    UsersModule,
    AuthModule,
    EnrollmentsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }], // la limite, sur toutes les routes
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}'); // toutes les routes (syntaxe d'Express 5)
  }
}
