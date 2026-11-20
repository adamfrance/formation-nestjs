import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { AuthUser } from './auth-user.interface.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from './public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register') // POST /api/auth/register : 201 et le compte créé
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 essais par minute : on ne devine pas un mot de passe
  @Post('login') // POST /api/auth/login : 200 et le jeton
  @HttpCode(200) // une connexion ne crée rien : 200 plutôt que 201
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile') // GET /api/auth/profile : le compte connecté, lu dans le jeton
  profile(@CurrentUser() user: AuthUser) {
    return user;
  }
}
