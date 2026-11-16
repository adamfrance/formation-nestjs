// Les équipements possibles : la même liste sert aux règles du DTO et au type
export const EQUIPMENTS = ['ecran', 'visio', 'tableau'] as const;
export type Equipment = (typeof EQUIPMENTS)[number]; // 'ecran' | 'visio' | 'tableau'

// Une salle de réunion
export interface Room {
  id: string;
  name: string;
  capacity: number; // le nombre de places
  equipments: Equipment[];
}
