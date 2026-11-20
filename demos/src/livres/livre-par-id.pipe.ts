import { Injectable, PipeTransform } from '@nestjs/common';
import { Livre } from './livre.entity.js';
import { LivresService } from './livres.service.js';

// Un pipe qui transforme : il reçoit un identifiant (déjà un nombre) et renvoie le livre, ou 404
@Injectable()
export class LivreParIdPipe implements PipeTransform<number, Promise<Livre>> {
  constructor(private readonly livresService: LivresService) {} // un pipe peut recevoir des services

  transform(id: number): Promise<Livre> {
    return this.livresService.findOne(id);
  }
}
