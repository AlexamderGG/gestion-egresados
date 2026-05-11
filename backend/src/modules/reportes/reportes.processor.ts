// backend/src/modules/reportes/reportes.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';

@Processor('reportes')
export class ReportesProcessor {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  @Process('generar-pdf')
  async handlePdfGeneration(job: Job) {
    const { reporteId, tipo, filtros } = job.data;
    
    console.log(`Generando reporte ${reporteId} de tipo ${tipo}`);
    
    // Simular generación de PDF (por ahora)
    const pdfUrl = `http://localhost:4000/uploads/reportes/${reporteId}.pdf`;
    
    // Actualizar el reporte
    await this.prisma.reporte.update({
      where: { id: reporteId },
      data: {
        estado: 'completado',
        urlPdf: pdfUrl,
        fechaCompletado: new Date(),
      },
    });
  }
}