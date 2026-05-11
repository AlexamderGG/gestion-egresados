import { PrismaService } from '../prisma/prisma.service';
export declare class CronService {
    private prisma;
    constructor(prisma: PrismaService);
    cerrarOfertasVencidas(): Promise<void>;
    verificarVacantesCompletas(): Promise<void>;
}
