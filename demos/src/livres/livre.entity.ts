import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Un livre, enregistré dans la table livres
@Entity('livres')
export class Livre {
  @PrimaryGeneratedColumn() // un entier donné par PostgreSQL : 1, 2, 3…
  id: number;

  @Column()
  titre: string;

  @Column()
  auteur: string;

  @Column({ type: 'int' })
  annee: number;

  @Column({ default: true })
  disponible: boolean;
}
