import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity.js';

// Un cours, enregistré dans la table courses de PostgreSQL
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid') // la clé primaire, un UUID donné par PostgreSQL
  id: string;

  @Column({ length: 120 }) // varchar(120)
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'int', default: 0 }) // le prix en centimes
  priceCents: number;

  @Column({ default: false })
  published: boolean;

  @OneToMany(() => Lesson, (lesson) => lesson.course) // l'autre côté de la relation : pas de colonne en base
  lessons: Relation<Lesson[]>;

  @CreateDateColumn() // remplie par PostgreSQL à l'insertion
  createdAt: Date;

  @UpdateDateColumn() // mise à jour à chaque modification
  updatedAt: Date;
}
