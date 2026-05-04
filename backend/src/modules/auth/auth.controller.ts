// backend/src/modules/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Credenciales inválidas' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { 
    email: string; 
    password: string; 
    role: string; 
    profileData?: any 
  }) {
    // Ahora pasamos los argumentos individualmente
    return this.authService.register(
      body.email,
      body.password,
      body.role,
      body.profileData
    );
  }
}