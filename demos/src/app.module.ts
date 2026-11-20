import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mediathequeConfig from './config/mediatheque.config.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LivresModule } from './livres/livres.module.js';
import { TrajetModule } from './trajet/trajet.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mediathequeConfig] }), // lit .env, puis les réglages nommés
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // les exemples créent leurs tables tout seuls ; LearnHub passera aux migrations
        logging: config.get('DB_LOGGING') === 'true', // DB_LOGGING=true : chaque requête SQL dans le terminal
      }),
    }),
    LivresModule,
    TrajetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
