import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaService();

export async function createContext({ req }: CreateExpressContextOptions) {
  let user = null;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto-temporal') as any;
      user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    } catch (e) {
      // token inválido -> user sigue null
    }
  }
  return { prisma, user };
}