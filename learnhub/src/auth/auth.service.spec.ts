import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import type { Mock } from 'vitest';
import { Role } from '../users/role.enum.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

vi.mock('bcrypt'); // toutes les fonctions de bcrypt remplacées par des fonctions simulées

describe('AuthService.login', () => {
  let service: AuthService;
  const usersService = { findByEmailWithPassword: vi.fn() };
  const jwtService = { signAsync: vi.fn() };
  const lea = { id: 'u1', email: 'lea.martin@example.com', passwordHash: 'hash', fullName: 'Lea Martin', role: Role.Teacher };

  beforeEach(async () => {
    vi.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('jeton-de-test');
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('renvoie un jeton quand le mot de passe est bon', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(lea);
    (bcrypt.compare as Mock).mockResolvedValue(true); // bcrypt « dit » que le mot de passe correspond
    await expect(service.login({ email: 'LEA.MARTIN@example.com', password: 'motdepasse' })).resolves.toEqual({
      access_token: 'jeton-de-test',
    });
    expect(usersService.findByEmailWithPassword).toHaveBeenCalledWith('lea.martin@example.com'); // adresse en minuscules
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'u1', email: 'lea.martin@example.com', role: Role.Teacher });
  });

  it('refuse un mauvais mot de passe', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(lea);
    (bcrypt.compare as Mock).mockResolvedValue(false);
    await expect(service.login({ email: lea.email, password: 'mauvais' })).rejects.toThrow(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('refuse une adresse inconnue, avec le même message', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);
    await expect(service.login({ email: 'personne@example.com', password: 'x' })).rejects.toThrow(
      'Adresse ou mot de passe incorrect',
    );
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });
});
