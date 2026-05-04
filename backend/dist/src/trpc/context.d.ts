import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { PrismaService } from '../prisma/prisma.service';
export declare function createContext({ req }: CreateExpressContextOptions): Promise<{
    prisma: PrismaService;
    user: any;
}>;
