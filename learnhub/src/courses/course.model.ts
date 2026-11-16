// Un cours du catalogue (en mémoire aujourd'hui, dans PostgreSQL au jour 2)
export interface Course {
  id: string;
  title: string;
  description: string;
  priceCents: number; // le prix en centimes : jamais de nombre à virgule pour de l'argent
  published: boolean; // visible des élèves ou encore en préparation
}
