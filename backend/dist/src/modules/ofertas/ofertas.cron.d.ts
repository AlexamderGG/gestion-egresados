import { PrismaService } from '../../prisma/prisma.service';
export declare class OfertasCron {
    private prisma;
    constructor(prisma: PrismaService);
    cerrarOfertasVencidas(): Promise<void>;
}
