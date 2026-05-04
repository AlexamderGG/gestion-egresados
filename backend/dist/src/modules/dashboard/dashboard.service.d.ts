import { PrismaService } from '../../prisma/prisma.service';
import { Redis } from 'ioredis';
import { KpiResult, OfertaDemandaMensual } from './interfaces';
export declare class DashboardService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: Redis);
    getGlobalKpis(): Promise<KpiResult>;
    getOfertasVsPostulacionesMensual(anio: number): Promise<OfertaDemandaMensual[]>;
    getDemandaHabilidades(): Promise<unknown>;
}
