import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Course } from '../courses/course.entity.js';

// Une leçon : plusieurs leçons pour un cours (relation many-to-one)
@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  title: string;

  @Column({ type: 'text', default: '' })
  content: string;

  @Column({ type: 'int' })
  position: number;

  @Column() // la clé étrangère, lisible directement
  courseId: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' }) // cours supprimé : ses leçons aussi
  @JoinColumn({ name: 'courseId' }) // la relation utilise la colonne courseId
  course: Relation<Course>;
}
