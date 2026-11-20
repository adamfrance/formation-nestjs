// Expérience : combien d'instances Nest fabrique-t-il, requête après requête ?
import { Controller, Get, Injectable, Module, Scope } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

let paniers = 0; // compte les paniers fabriqués par Nest
let comptoirs = 0; // compte les contrôleurs fabriqués

@Injectable({ scope: Scope.REQUEST }) // second essai : Scope.DEFAULT
class Panier {
  readonly numero = ++paniers; // le numéro de cette instance
}

@Controller('panier')
class PanierController {
  readonly numero = ++comptoirs; // le numéro de cette instance du contrôleur
  constructor(private readonly panier: Panier) {} // le contrôleur dépend du panier

  @Get()
  lire() {
    return { panier: this.panier.numero, controleur: this.numero }; // les deux numéros, en JSON
  }
}

@Module({ controllers: [PanierController], providers: [Panier] })
class ExperienceModule {}

const app = await NestFactory.create(ExperienceModule, { logger: false }); // sans le journal de Nest
await app.listen(0, '127.0.0.1'); // un port libre, choisi par le système
const url = await app.getUrl(); // l'adresse réelle, avec ce port
for (const essai of [1, 2, 3]) {
  const reponse = await fetch(`${url}/panier`); // une requête HTTP, comme curl
  console.log(`requête ${essai} :`, await reponse.json()); // ce que l'API a répondu
}
await app.close(); // arrête le serveur : le script se termine
