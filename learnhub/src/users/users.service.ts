import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.users.existsBy({ email }); // SELECT … LIMIT 1 : vrai ou faux
  }

  // Pour la connexion seulement : on demande aussi le mot de passe haché, exclu par défaut
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(data: Pick<User, 'email' | 'passwordHash' | 'fullName' | 'role'>): Promise<User> {
    return this.users.save(this.users.create(data)); // INSERT ; une adresse déjà prise : erreur de PostgreSQL
  }
}
