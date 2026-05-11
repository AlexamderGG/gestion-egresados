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
exports.ReportesProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../../common/storage/storage.service");
let ReportesProcessor = class ReportesProcessor {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async handlePdfGeneration(job) {
        const { reporteId, tipo, filtros } = job.data;
        console.log(`Generando reporte ${reporteId} de tipo ${tipo}`);
        const pdfUrl = `http://localhost:4000/uploads/reportes/${reporteId}.pdf`;
        await this.prisma.reporte.update({
            where: { id: reporteId },
            data: {
                estado: 'completado',
                urlPdf: pdfUrl,
                fechaCompletado: new Date(),
            },
        });
    }
};
exports.ReportesProcessor = ReportesProcessor;
__decorate([
    (0, bull_1.Process)('generar-pdf'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportesProcessor.prototype, "handlePdfGeneration", null);
exports.ReportesProcessor = ReportesProcessor = __decorate([
    (0, bull_1.Processor)('reportes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ReportesProcessor);
//# sourceMappingURL=reportes.processor.js.map