import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';

@Injectable()
export class ReportesService {
  constructor(
    @InjectQueue('reportes') private reportQueue: Queue,
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async solicitarReporte(usuarioId: string, tipo: string, filtros: any) {
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

  async descargarReporte(reporteId: string) {
    const reporte = await this.prisma.reporte.findUnique({ where: { id: reporteId } });
    if (reporte?.estado === 'completado' && reporte.urlPdf) {
      return reporte.urlPdf; // o reporte.url_pdf según el nombre en Prisma
    }
    throw new Error('Reporte no disponible');
  }
}