import { Inject, Injectable } from '@nestjs/common';
import { LivresService } from './livres.service.js';
import { DUREE_PRET_JOURS, HORLOGE } from './livres.tokens.js';
import type { Horloge } from './livres.tokens.js';
import { LivreDejaPreteException } from './livre-deja-prete.exception.js';
import { LecteurDto } from './dto/create-emprunt.dto.js';
import { EmpruntVue } from './emprunt.vue.js';

@Injectable()
export class EmpruntsService {
  constructor(
    private readonly livresService: LivresService, // injecté par sa classe
    @Inject(DUREE_PRET_JOURS) private readonly dureeJours: number, // injecté par son jeton : une valeur
    @Inject(HORLOGE) private readonly horloge: Horloge, // injecté par son jeton : un objet fabriqué
  ) {}

  async emprunter(id: number, lecteur: LecteurDto): Promise<EmpruntVue> {
    const livre = await this.livresService.findOne(id);
    if (!livre.disponible) {
      throw new LivreDejaPreteException(livre.titre); // 409, avec un nom qui dit le problème
    }
    await this.livresService.update(id, { disponible: false });
    const retour = this.horloge.maintenant();
    retour.setDate(retour.getDate() + this.dureeJours);
    return new EmpruntVue({
      livre: livre.titre,
      aRendreLe: retour.toISOString().slice(0, 10),
      lecteur: lecteur.nom,
      email: lecteur.email,
    });
  }
}
