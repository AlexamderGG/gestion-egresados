import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }

  async register(email: string, password: string, role: string, profileData?: any) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash: hashed, role: role as any },
    });
    if (role === 'egresado') {
      await this.prisma.egresado.create({ data: { id: user.id, ...profileData } });
    } else if (role === 'empresa') {
      await this.prisma.empresa.create({ data: { id: user.id, ...profileData } });
    }
    return this.login(user);
  }
}