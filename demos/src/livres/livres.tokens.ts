// Les jetons des providers personnalisés du module
export const DUREE_PRET_JOURS = 'DUREE_PRET_JOURS';
export const HORLOGE = 'HORLOGE';

// Ce que fournit le provider HORLOGE : l'heure courante, remplaçable dans un test
export interface Horloge {
  maintenant(): Date;
}
