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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let CronService = class CronService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async cerrarOfertasVencidas() {
        const hoy = new Date();
        console.log(`🕐 Ejecutando: cerrar ofertas vencidas - ${hoy.toLocaleString()}`);
        try {
            const result = await this.prisma.oferta.updateMany({
                where: {
                    activa: true,
                    fechaCierre: {
                        lt: hoy,
                    },
                },
                data: { activa: false },
            });
            if (result.count > 0) {
                console.log(`🔒 Se cerraron ${result.count} ofertas por fecha de vencimiento`);
            }
        }
        catch (error) {
            console.error('❌ Error al cerrar ofertas vencidas:', error);
        }
    }
    async verificarVacantesCompletas() {
        try {
            const ofertas = await this.prisma.oferta.findMany({
                where: {
                    activa: true,
                },
            });
            for (const oferta of ofertas) {
                if (oferta.vacantesCubiertas >= oferta.vacantes) {
                    await this.prisma.oferta.update({
                        where: { id: oferta.id },
                        data: { activa: false, fechaCierre: new Date() },
                    });
                    console.log(`🔒 Oferta "${oferta.titulo}" cerrada por completar vacantes`);
                }
            }
        }
        catch (error) {
            console.error('Error verificando vacantes:', error);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "cerrarOfertasVencidas", null);
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "verificarVacantesCompletas", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CronService);
//# sourceMappingURL=cron.service.js.map