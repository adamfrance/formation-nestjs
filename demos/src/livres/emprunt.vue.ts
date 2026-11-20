import { Exclude } from 'class-transformer';

// Ce que renvoie un emprunt : l'adresse du lecteur reste dans le serveur
export class EmpruntVue {
  livre: string;
  aRendreLe: string;
  lecteur: string;

  @Exclude() // retirée de la réponse par ClassSerializerInterceptor
  email: string;

  constructor(valeurs: EmpruntVue) {
    Object.assign(this, valeurs);
  }
}
