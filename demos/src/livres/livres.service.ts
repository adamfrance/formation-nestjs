import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Livre } from './livre.entity.js';
import { CreateLivreDto } from './dto/create-livre.dto.js';
import { UpdateLivreDto } from './dto/update-livre.dto.js';

@Injectable()
export class LivresService implements OnModuleInit {
  private readonly logger = new Logger(LivresService.name);

  constructor(@InjectRepository(Livre) private readonly livres: Repository<Livre>) {} // le repository de la table

  // Au premier démarrage, la table est vide : on y range trois livres
  async onModuleInit() {
    if ((await this.livres.count()) === 0) {
      await this.livres.save([
        { titre: 'Dune', auteur: 'Frank Herbert', annee: 1965 },
        { titre: 'Fondation', auteur: 'Isaac Asimov', annee: 1951, disponible: false },
        { titre: 'La Horde du Contrevent', auteur: 'Alain Damasio', annee: 2004 },
      ]);
    }
    this.logger.log(`${await this.livres.count()} livres en rayon`);
  }

  findAll(auteur?: string): Promise<Livre[]> {
    return this.livres.find({
      where: auteur ? { auteur: ILike(`%${auteur}%`) } : {}, // ILike : sans tenir compte des majuscules
      order: { id: 'ASC' },
    });
  }

  disponibles(): Promise<Livre[]> {
    return this.livres.findBy({ disponible: true }); // SELECT … WHERE "disponible" = true
  }

  async findOne(id: number): Promise<Livre> {
    const livre = await this.livres.findOneBy({ id });
    if (!livre) {
      throw new NotFoundException(`Livre ${id} introuvable`);
    }
    return livre;
  }

  create(dto: CreateLivreDto): Promise<Livre> {
    const livre = this.livres.create({ titre: dto.titre, auteur: dto.auteur, annee: dto.annee });
    livre.disponible = dto.disponible ?? true; // par défaut, en rayon
    return this.livres.save(livre); // INSERT
  }

  async update(id: number, dto: UpdateLivreDto): Promise<Livre> {
    const livre = await this.findOne(id);
    return this.livres.save(this.livres.merge(livre, dto)); // UPDATE des champs envoyés
  }

  async remove(id: number): Promise<void> {
    await this.livres.remove(await this.findOne(id)); // DELETE
  }
}
