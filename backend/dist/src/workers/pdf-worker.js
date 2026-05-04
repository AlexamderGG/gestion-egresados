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
exports.PdfWorker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const bull_1 = require("@nestjs/bull");
const renderer_1 = require("@react-pdf/renderer");
const MyReportDocument_1 = require("./templates/MyReportDocument");
const storage_service_1 = require("../common/storage/storage.service");
const prisma_service_1 = require("../prisma/prisma.service");
let PdfWorker = class PdfWorker {
    constructor(storage, prisma) {
        this.storage = storage;
        this.prisma = prisma;
    }
    async handlePdfGeneration(job) {
        const { reporteId, tipo, filtros } = job.data;
        let data = [];
        if (tipo === 'empleabilidad') {
            data = await this.prisma.$queryRaw `SELECT * FROM mv_empleabilidad_por_carrera WHERE ...`;
        }
        const pdfStream = await (0, renderer_1.renderToStream)((0, jsx_runtime_1.jsx)(MyReportDocument_1.MyReportDocument, { data: data, filtros: filtros }));
        const chunks = [];
        for await (const chunk of pdfStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        const url = await this.storage.upload(`reportes/${reporteId}.pdf`, buffer);
        await this.prisma.reporte.update({
            where: { id: reporteId },
            data: { estado: 'completado', urlPdf: url, fechaCompletado: new Date() },
        });
    }
};
exports.PdfWorker = PdfWorker;
__decorate([
    (0, bull_1.Process)('generar-pdf'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfWorker.prototype, "handlePdfGeneration", null);
exports.PdfWorker = PdfWorker = __decorate([
    (0, bull_1.Processor)('reportes'),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        prisma_service_1.PrismaService])
], PdfWorker);
//# sourceMappingURL=pdf-worker.js.map