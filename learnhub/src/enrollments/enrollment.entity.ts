import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Course } from '../courses/course.entity.js';
import { User } from '../users/user.entity.js';

// Une inscription : un élève suit un cours. Une entité de jointure, avec sa propre colonne (la date)
@Entity('enrollments')
@Index(['studentId', 'courseId'], { unique: true }) // on ne s'inscrit qu'une fois au même cours
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Relation<User>;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Relation<Course>;

  @CreateDateColumn()
  enrolledAt: Date;
}
