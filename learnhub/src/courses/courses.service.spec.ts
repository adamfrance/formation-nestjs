import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { AuthUser } from '../auth/auth-user.interface.js';
import { Role } from '../users/role.enum.js';
import { Course } from './course.entity.js';
import { COURSES_SEED } from './courses.seed.js';
import { CoursesService } from './courses.service.js';

describe('CoursesService', () => {
  let service: CoursesService;
  const repository = { findOneBy: vi.fn(), merge: vi.fn(), save: vi.fn() }; // un faux repository
  const lea: AuthUser = { sub: 'lea', email: 'lea@example.com', role: Role.Teacher };
  const sam: AuthUser = { sub: 'sam', email: 'sam@example.com', role: Role.Teacher };

  beforeEach(async () => {
    vi.clearAllMocks(); // chaque test repart de fonctions simulées neuves
    const moduleRef = await Test.createTestingModule({
      providers: [
        CoursesService, // la vraie classe testée
        { provide: getRepositoryToken(Course), useValue: repository }, // à la place du repository de TypeORM
        { provide: COURSES_SEED, useValue: [] },
        { provide: CACHE_MANAGER, useValue: { clear: vi.fn() } },
      ],
    }).compile();
    service = moduleRef.get(CoursesService);
  });

  it('renvoie le cours trouvé', async () => {
    repository.findOneBy.mockResolvedValue({ id: 'c1', title: 'Découvrir NestJS' }); // Arrange : ce que « trouve » la base
    const course = await service.findOne('c1'); // Act
    expect(course).toEqual({ id: 'c1', title: 'Découvrir NestJS' }); // Assert
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('lève NotFoundException si le cours est introuvable', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.findOne('inconnu')).rejects.toThrow(NotFoundException);
  });

  it("refuse la modification par un autre formateur que l'auteur", async () => {
    repository.findOneBy.mockResolvedValue({ id: 'c1', teacherId: lea.sub });
    await expect(service.update('c1', { published: true }, sam)).rejects.toThrow(ForbiddenException);
    expect(repository.save).not.toHaveBeenCalled(); // rien n'a été écrit
  });
});
