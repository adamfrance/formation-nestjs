import { registerAs } from '@nestjs/config';

// Les réglages de la médiathèque, lus une fois au démarrage et rangés sous le nom « mediatheque »
export default registerAs('mediatheque', () => ({
  cleApi: process.env.CLE_API ?? '',
  dureePretJours: parseInt(process.env.DUREE_PRET_JOURS ?? '21', 10), // une variable d'environnement est un texte
}));
