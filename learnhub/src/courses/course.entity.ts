import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity.js';
import { User } from '../users/user.entity.js';

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

  @Column({ type: 'uuid', nullable: true }) // le formateur auteur ; vide pour le catalogue de départ
  teacherId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }) // compte supprimé : le cours reste, sans auteur
  @JoinColumn({ name: 'teacherId' })
  teacher: User | null;

  @OneToMany(() => Lesson, (lesson) => lesson.course) // l'autre côté de la relation : pas de colonne en base
  lessons: Relation<Lesson[]>;

  @CreateDateColumn() // remplie par PostgreSQL à l'insertion
  createdAt: Date;

  @UpdateDateColumn() // mise à jour à chaque modification
  updatedAt: Date;
}
