import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrajetFilter } from './trajet.filter.js';
import { TrajetGuard } from './trajet.guard.js';
import { TrajetInterceptor } from './trajet.interceptor.js';
import { TrajetPipe } from './trajet.pipe.js';

// GET /api/trajet/:mot : chaque étape du trajet écrit une ligne dans le terminal
@Controller('trajet')
@UseGuards(TrajetGuard)
@UseInterceptors(TrajetInterceptor)
@UseFilters(TrajetFilter)
export class TrajetController {
  @Get(':mot')
  echo(@Param('mot', TrajetPipe) mot: string, @Query('erreur') erreur?: string) {
    if (erreur) {
      throw new BadRequestException('erreur demandée');
    }
    new Logger('Trajet').log(`5. méthode du contrôleur : reçoit « ${mot} »`);
    return { mot };
  }
}
