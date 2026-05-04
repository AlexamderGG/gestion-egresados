import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Redis } from 'ioredis';
import { KpiResult, OfertaDemandaMensual } from './interfaces';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async getGlobalKpis(): Promise<KpiResult> {
    const cacheKey = 'dashboard:kpis';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [totalEgresados, totalEmpresas, ofertasActivas, tasaEmpleabilidad] = await Promise.all([
      this.prisma.egresado.count(),
      this.prisma.empresa.count(),
      this.prisma.oferta.count({ where: { activa: true } }),
      this.prisma.$queryRaw`SELECT tasa_empleabilidad FROM mv_empleabilidad_por_carrera LIMIT 1`,
    ]);
    const result = { totalEgresados, totalEmpresas, ofertasActivas, tasaEmpleabilidad:0 };
    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getOfertasVsPostulacionesMensual(anio: number): Promise<OfertaDemandaMensual[]> {
    // Consulta agregada desde PostgreSQL
    const data = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM fecha_publicacion) as mes,
        COUNT(DISTINCT o.id) as ofertas,
        COUNT(p.id) as postulaciones
      FROM ofertas o
      LEFT JOIN postulaciones p ON o.id = p.oferta_id
      WHERE EXTRACT(YEAR FROM fecha_publicacion) = ${anio}
      GROUP BY mes
      ORDER BY mes
    `;
    return data as any;
  }

  async getDemandaHabilidades() {
    return this.prisma.$queryRaw`SELECT * FROM mv_demanda_habilidades ORDER BY cantidad_ofertas DESC LIMIT 10`;
  }
}