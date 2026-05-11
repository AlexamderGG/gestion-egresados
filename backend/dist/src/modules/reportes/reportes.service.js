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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../../common/storage/storage.service");
let ReportesService = class ReportesService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async solicitarReporte(usuarioId, tipo, filtros) {
        console.log(`📊 Solicitando reporte: ${tipo} para usuario ${usuarioId}`);
        const reporte = await this.prisma.reporte.create({
            data: {
                usuarioId,
                tipoReporte: tipo,
                filtrosAplicados: filtros,
                estado: 'procesando',
            },
        });
        try {
            const fileUrl = await this.generarReporte(reporte.id, tipo, filtros);
            await this.prisma.reporte.update({
                where: { id: reporte.id },
                data: {
                    estado: 'completado',
                    urlPdf: fileUrl,
                    fechaCompletado: new Date(),
                },
            });
            console.log(`✅ Reporte ${reporte.id} completado: ${fileUrl}`);
            return reporte;
        }
        catch (error) {
            console.error('❌ Error generando reporte:', error);
            await this.prisma.reporte.update({
                where: { id: reporte.id },
                data: { estado: 'error' },
            });
            throw error;
        }
    }
    async generarReporte(reporteId, tipo, filtros) {
        const htmlContent = await this.generarHTML(tipo, filtros);
        const buffer = Buffer.from(htmlContent, 'utf-8');
        const fileUrl = await this.storage.upload(`reportes/${reporteId}.html`, buffer);
        return fileUrl;
    }
    async generarHTML(tipo, filtros) {
        if (tipo === 'empleabilidad') {
            const totalEgresados = await this.prisma.egresado.count();
            const contratados = await this.prisma.postulacion.count({
                where: { estado: 'contratado' }
            });
            const tasa = totalEgresados > 0 ? (contratados / totalEgresados) * 100 : 0;
            const egresadosPorCarrera = await this.prisma.egresado.findMany({
                select: { carrera: true, id: true }
            });
            const carreraMap = new Map();
            for (const eg of egresadosPorCarrera) {
                const carrera = eg.carrera || 'No especificada';
                carreraMap.set(carrera, (carreraMap.get(carrera) || 0) + 1);
            }
            const postulacionesContratadas = await this.prisma.postulacion.findMany({
                where: { estado: 'contratado' },
                select: { egresadoId: true }
            });
            const egresadosContratadosIds = new Set(postulacionesContratadas.map(p => p.egresadoId));
            const contratadosMap = new Map();
            for (const eg of egresadosPorCarrera) {
                if (egresadosContratadosIds.has(eg.id)) {
                    const carrera = eg.carrera || 'No especificada';
                    contratadosMap.set(carrera, (contratadosMap.get(carrera) || 0) + 1);
                }
            }
            let carrerasHtml = '';
            for (const [carrera, total] of carreraMap.entries()) {
                const contratadosCarrera = contratadosMap.get(carrera) || 0;
                const tasaCarrera = total > 0 ? (contratadosCarrera / total) * 100 : 0;
                carrerasHtml += `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${carrera}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${total}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${contratadosCarrera}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${tasaCarrera.toFixed(1)}%</td>
          </tr>
        `;
            }
            return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Empleabilidad</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #fff;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 15px;
            }
            h1 { 
              color: #1e3a8a; 
              margin: 0 0 5px 0;
              font-size: 28px;
            }
            h2 { 
              color: #4b5563; 
              margin: 5px 0;
              font-size: 20px;
            }
            .date { 
              color: #6b7280; 
              font-size: 11px; 
              margin-top: 5px; 
            }
            .section { 
              margin-top: 25px; 
              margin-bottom: 25px; 
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              background-color: #f3f4f6; 
              padding: 8px 12px; 
              border-left: 4px solid #2563eb; 
              margin-bottom: 15px;
            }
            .kpi-container { 
              display: flex; 
              gap: 20px; 
              margin-top: 15px; 
              flex-wrap: wrap;
            }
            .kpi-card { 
              background: #eff6ff; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center; 
              flex: 1;
              min-width: 120px;
            }
            .kpi-value { 
              font-size: 32px; 
              font-weight: bold; 
              color: #2563eb; 
            }
            .kpi-label { 
              font-size: 12px; 
              color: #6b7280; 
              margin-top: 8px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 15px; 
            }
            th { 
              background-color: #f3f4f6; 
              font-weight: bold; 
              padding: 10px; 
              border: 1px solid #ddd; 
              text-align: left;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 10px; 
              color: #9ca3af; 
              border-top: 1px solid #e5e7eb; 
              padding-top: 15px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sistema de Gestión de Egresados</h1>
            <h2>Reporte de Empleabilidad</h2>
            <div class="date">Generado: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Filtros Aplicados</div>
            ${filtros?.fechaDesde ? `<p style="margin: 5px 0;">📅 Desde: ${filtros.fechaDesde}</p>` : ''}
            ${filtros?.fechaHasta ? `<p style="margin: 5px 0;">📅 Hasta: ${filtros.fechaHasta}</p>` : ''}
            ${!filtros?.fechaDesde && !filtros?.fechaHasta ? '<p style="margin: 5px 0;">Sin filtros aplicados</p>' : ''}
          </div>
          
          <div class="section">
            <div class="section-title">Indicadores Clave</div>
            <div class="kpi-container">
              <div class="kpi-card">
                <div class="kpi-value">${totalEgresados}</div>
                <div class="kpi-label">Total Egresados</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-value">${contratados}</div>
                <div class="kpi-label">Egresados Contratados</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-value">${tasa.toFixed(2)}%</div>
                <div class="kpi-label">Tasa de Empleabilidad</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Empleabilidad por Carrera</div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 10px; border: 1px solid #ddd; background: #f3f4f6;">Carrera</th>
                  <th style="padding: 10px; border: 1px solid #ddd; background: #f3f4f6; text-align: center;">Egresados</th>
                  <th style="padding: 10px; border: 1px solid #ddd; background: #f3f4f6; text-align: center;">Contratados</th>
                  <th style="padding: 10px; border: 1px solid #ddd; background: #f3f4f6; text-align: center;">Tasa</th>
                </tr>
              </thead>
              <tbody>
                ${carrerasHtml || '<tr><td colspan="4" style="text-align: center;">No hay datos disponibles</td></tr>'}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            Reporte generado automáticamente por el Sistema de Gestión de Egresados
          </div>
        </body>
        </html>
      `;
        }
        if (tipo === 'ofertas_activas') {
            const ofertas = await this.prisma.oferta.findMany({
                where: { activa: true },
                include: { empresa: true },
            });
            let ofertasHtml = '';
            for (const oferta of ofertas) {
                ofertasHtml += `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin: 0 0 5px 0; color: #1e3a8a;">${oferta.titulo}</h3>
            <p style="margin: 5px 0;"><strong>🏢 Empresa:</strong> ${oferta.empresa?.nombreEmpresa || 'No especificada'}</p>
            <p style="margin: 5px 0;"><strong>📍 Modalidad:</strong> ${oferta.modalidad || 'No especificada'}</p>
            <p style="margin: 5px 0;"><strong>📝 Descripción:</strong> ${oferta.descripcion?.substring(0, 200)}${oferta.descripcion?.length > 200 ? '...' : ''}</p>
            ${oferta.salarioMin && oferta.salarioMax ? `<p style="margin: 5px 0;"><strong>💰 Salario:</strong> ${oferta.salarioMin} - ${oferta.salarioMax} USD</p>` : ''}
          </div>
        `;
            }
            return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Ofertas Activas</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 15px; }
            h1 { color: #1e3a8a; margin: 0 0 5px 0; }
            .date { color: #6b7280; font-size: 11px; margin-top: 5px; }
            .section-title { font-size: 18px; font-weight: bold; background-color: #f3f4f6; padding: 8px 12px; border-left: 4px solid #2563eb; margin-bottom: 15px; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sistema de Gestión de Egresados</h1>
            <h2>Reporte de Ofertas Activas</h2>
            <div class="date">Generado: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Ofertas Activas (${ofertas.length})</div>
            ${ofertasHtml || '<p>No hay ofertas activas disponibles</p>'}
          </div>
          
          <div class="footer">
            Reporte generado automáticamente por el Sistema de Gestión de Egresados
          </div>
        </body>
        </html>
      `;
        }
        return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Reporte</title></head>
      <body>
        <h1>Reporte no disponible</h1>
        <p>El tipo de reporte solicitado no es válido.</p>
      </body>
      </html>
    `;
    }
    async listarReportes(usuarioId) {
        return this.prisma.reporte.findMany({
            where: { usuarioId },
            orderBy: { fechaSolicitud: 'desc' },
        });
    }
    async descargarReporte(reporteId) {
        return this.prisma.reporte.findUnique({
            where: { id: reporteId },
        });
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map