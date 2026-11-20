import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum.js';

// Un compte de LearnHub
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // deux comptes ne peuvent pas avoir la même adresse
  email: string;

  @Column({ select: false }) // jamais lu par défaut : le mot de passe haché ne sort pas par mégarde
  passwordHash: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ type: 'enum', enum: Role, default: Role.Student }) // un type énuméré de PostgreSQL
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
