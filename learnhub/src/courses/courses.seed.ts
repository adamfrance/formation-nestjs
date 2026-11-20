import { CreateCourseDto } from './dto/create-course.dto.js';

// Le jeton du provider : le nom sous lequel Nest range le catalogue de départ
export const COURSES_SEED = 'COURSES_SEED';

// Le catalogue de départ, chargé au démarrage de l'application
export const SEED_COURSES: CreateCourseDto[] = [
  {
    title: 'Découvrir NestJS',
    description: 'Modules, contrôleurs et services pas à pas',
    priceCents: 0,
    published: true,
  },
  {
    title: 'PostgreSQL pour les développeurs',
    description: 'Tables, requêtes et index',
    priceCents: 4900,
    published: true,
  },
  {
    title: 'Docker en pratique',
    description: 'Images, conteneurs et Compose',
    priceCents: 2900,
    published: false,
  },
];
