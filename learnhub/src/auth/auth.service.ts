import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/role.enum.js';
import { UsersService } from '../users/users.service.js';
import type { AuthUser } from './auth-user.interface.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // fourni par JwtModule
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase(); // une adresse, quelle que soit la casse tapée
    if (await this.usersService.existsByEmail(email)) {
      throw new ConflictException('Cette adresse est déjà utilisée'); // 409
    }
    const passwordHash = await bcrypt.hash(dto.password, 10); // 10 : le coût du calcul (2^10 tours)
    const user = await this.usersService.create({
      email,
      passwordHash,
      fullName: dto.fullName,
      role: dto.role ?? Role.Student,
    });
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role }; // jamais le mot de passe haché
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email.toLowerCase());
    const ok = user ? await bcrypt.compare(dto.password, user.passwordHash) : false; // compare au hash, sans le défaire
    if (!user || !ok) {
      throw new UnauthorizedException('Adresse ou mot de passe incorrect'); // un seul message : on ne dit pas lequel est faux
    }
    const payload: AuthUser = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) }; // le jeton, signé avec JWT_SECRET
  }
}
