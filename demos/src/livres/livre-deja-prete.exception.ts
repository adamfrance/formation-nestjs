import { ConflictException } from '@nestjs/common';

// Une exception métier : son nom dit ce qui s'est passé, son parent donne le statut HTTP (409)
export class LivreDejaPreteException extends ConflictException {
  constructor(titre: string) {
    super(`« ${titre} » est déjà prêté`);
  }
}
