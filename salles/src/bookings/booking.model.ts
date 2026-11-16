// La réservation d'une salle sur un créneau
export interface Booking {
  id: string;
  roomId: string;
  title: string;
  start: string; // date et heure ISO 8601, avec le fuseau : 2026-11-20T09:00:00+01:00
  end: string;
  attendees: number; // le nombre de participants
}
