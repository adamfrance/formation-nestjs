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

  // Documentation de l'API : Swagger UI sur http://localhost:3000/docs
  const config = new DocumentBuilder()
    .setTitle('LearnHub')
    .setDescription('API de la plateforme de formation LearnHub')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config); // lit les routes et les décorateurs
  SwaggerModule.setup('docs', app, document); // sert la page de documentation

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
