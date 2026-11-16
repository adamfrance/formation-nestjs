import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // toutes les routes commencent par /api
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // retire les champs que le DTO ne connaît pas
      forbidNonWhitelisted: true, // et refuse la requête s'il y en a
      transform: true, // fournit au contrôleur une instance du DTO
    }),
  );

  // Documentation de l'API : Swagger UI sur http://localhost:3003/docs
  const config = new DocumentBuilder()
    .setTitle('Salles')
    .setDescription('Réservation des salles de réunion')
    .setVersion('0.1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config)); // la description, puis la page

  await app.listen(process.env.PORT ?? 3003); // 3003 : 3000 à 3002 sont déjà pris
}
await bootstrap();
