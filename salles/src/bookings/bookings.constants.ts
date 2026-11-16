// Les jetons des deux providers personnalisés du module
export const CLOCK = 'CLOCK'; // l'horloge : un test la remplacera par une horloge arrêtée
export const BOOKING_RULES = 'BOOKING_RULES'; // les règles de réservation

export interface Clock {
  now(): Date;
}

export interface BookingRules {
  maxMinutes: number; // la durée maximale d'une réservation
}
