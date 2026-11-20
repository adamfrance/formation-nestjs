import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app); // les mêmes réglages que dans les tests de bout en bout

  // Documentation de l'API : Swagger UI sur http://localhost:3010/docs
  const config = new DocumentBuilder()
    .setTitle('LearnHub')
    .setDescription('API de la plateforme de formation LearnHub')
    .setVersion('0.1.0')
    .addBearerAuth() // le bouton « Authorize » : coller un jeton pour essayer les routes protégées
    .addSecurityRequirements('bearer') // le jeton est envoyé avec chaque essai
    .build();
  const document = SwaggerModule.createDocument(app, config); // lit les routes et les décorateurs
  SwaggerModule.setup('docs', app, document); // sert la page de documentation

  const configService = app.get(ConfigService); // le service de configuration, pris dans le conteneur de Nest
  await app.listen(configService.getOrThrow<number>('PORT'));
}
await bootstrap();
