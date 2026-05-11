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
  try {
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    // Si Redis falla, continuar sin caché
    console.warn('Redis no disponible:', err);
  }

  const [totalEgresados, totalEmpresas, ofertasActivas] = await Promise.all([
    this.prisma.egresado.count(),
    this.prisma.empresa.count(),
    this.prisma.oferta.count({ where: { activa: true } }),
  ]);

  // Calcular tasa de empleabilidad (egresados con al menos una postulación en estado 'contratado')
  const contratados = await this.prisma.postulacion.groupBy({
    by: ['egresadoId'],
    where: { estado: 'contratado' },
  });
  const totalContratados = contratados.length;
  const tasaEmpleabilidad = totalEgresados === 0 ? 0 : (totalContratados / totalEgresados) * 100;

  const result = { totalEgresados, totalEmpresas, ofertasActivas, tasaEmpleabilidad: Math.round(tasaEmpleabilidad) };

  // Guardar en caché solo si Redis está disponible
  try {
    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    // Ignorar error de caché
  }
  return result;
}

  async getOfertasVsPostulacionesMensual(anio: number): Promise<OfertaDemandaMensual[]> {
  const data = await this.prisma.$queryRaw<OfertaDemandaMensual[]>`
    SELECT 
      EXTRACT(MONTH FROM fecha_publicacion)::int as mes,
      COUNT(DISTINCT o.id) as ofertas,
      COUNT(p.id) as postulaciones
    FROM ofertas o
    LEFT JOIN postulaciones p ON o.id = p.oferta_id
    WHERE EXTRACT(YEAR FROM fecha_publicacion) = ${anio}
    GROUP BY mes
    ORDER BY mes
  `;
  return data;
}

  async getDemandaHabilidades() {
  try {
    const result = await this.prisma.$queryRaw`SELECT * FROM mv_demanda_habilidades ORDER BY cantidad_ofertas DESC LIMIT 10`;
    return result || []; // Asegurar array
  } catch (error) {
    console.warn('Error obteniendo habilidades:', error);
    return []; // Siempre devolver array
  }
}
}