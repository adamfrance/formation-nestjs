import type { Room } from './room.model.js';

export const ROOMS_SEED = 'ROOMS_SEED'; // le jeton sous lequel Nest range les salles de départ

// Les salles de départ, chargées au démarrage
export const SEED_ROOMS: Omit<Room, 'id'>[] = [
  { name: 'Atlas', capacity: 8, equipments: ['ecran', 'visio'] },
  { name: 'Bora', capacity: 4, equipments: ['tableau'] },
  { name: 'Cassiopée', capacity: 20, equipments: ['ecran', 'visio', 'tableau'] },
];
