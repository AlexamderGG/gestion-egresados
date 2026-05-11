"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ioredis_1 = require("ioredis");
let DashboardService = class DashboardService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getGlobalKpis() {
        const cacheKey = 'dashboard:kpis';
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        catch (err) {
            console.warn('Redis no disponible:', err);
        }
        const [totalEgresados, totalEmpresas, ofertasActivas] = await Promise.all([
            this.prisma.egresado.count(),
            this.prisma.empresa.count(),
            this.prisma.oferta.count({ where: { activa: true } }),
        ]);
        const contratados = await this.prisma.postulacion.groupBy({
            by: ['egresadoId'],
            where: { estado: 'contratado' },
        });
        const totalContratados = contratados.length;
        const tasaEmpleabilidad = totalEgresados === 0 ? 0 : (totalContratados / totalEgresados) * 100;
        const result = { totalEgresados, totalEmpresas, ofertasActivas, tasaEmpleabilidad: Math.round(tasaEmpleabilidad) };
        try {
            await this.redis.setex(cacheKey, 300, JSON.stringify(result));
        }
        catch (err) {
        }
        return result;
    }
    async getOfertasVsPostulacionesMensual(anio) {
        const data = await this.prisma.$queryRaw `
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
            const result = await this.prisma.$queryRaw `SELECT * FROM mv_demanda_habilidades ORDER BY cantidad_ofertas DESC LIMIT 10`;
            return result || [];
        }
        catch (error) {
            console.warn('Error obteniendo habilidades:', error);
            return [];
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ioredis_1.Redis])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map