import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from '../auth/public.decorator.js';

// GET /api/health : l'API répond-elle, et la base aussi ? Interrogé par Docker et par la plateforme d'hébergement
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {} // la connexion de TypeORM

  @Public()
  @Get()
  async check() {
    await this.dataSource.query('SELECT 1'); // une erreur ici : 500, l'instance est déclarée malade
    return { status: 'ok' };
  }
}
