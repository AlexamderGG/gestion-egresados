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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../../common/storage/storage.service");
let ReportesService = class ReportesService {
    constructor(reportQueue, prisma, storage) {
        this.reportQueue = reportQueue;
        this.prisma = prisma;
        this.storage = storage;
    }
    async solicitarReporte(usuarioId, tipo, filtros) {
        const reporte = await this.prisma.reporte.create({
            data: {
                usuarioId: usuarioId,
                tipoReporte: tipo,
                filtrosAplicados: filtros,
                estado: 'en_cola',
            },
        });
        await this.reportQueue.add('generar-pdf', { reporteId: reporte.id, tipo, filtros });
        return reporte;
    }
    async descargarReporte(reporteId) {
        const reporte = await this.prisma.reporte.findUnique({ where: { id: reporteId } });
        if (reporte?.estado === 'completado' && reporte.urlPdf) {
            return reporte.urlPdf;
        }
        throw new Error('Reporte no disponible');
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('reportes')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map