import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { renderToStream } from '@react-pdf/renderer';
import { MyReportDocument } from './templates/MyReportDocument';
import { StorageService } from '../common/storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';

@Processor('reportes')
export class PdfWorker {
  constructor(
    private storage: StorageService,
    private prisma: PrismaService,
  ) {}

  @Process('generar-pdf')
  async handlePdfGeneration(job: Job) {
    const { reporteId, tipo, filtros } = job.data;

    // Obtener datos según el tipo de reporte (ejemplo)
    let data = [];
    if (tipo === 'empleabilidad') {
      data = await this.prisma.$queryRaw`SELECT * FROM mv_empleabilidad_por_carrera WHERE ...`;
    }

    // Renderizar PDF a stream
    const pdfStream = await renderToStream(
      <MyReportDocument data={data} filtros={filtros} />
    );

    // Convertir stream a buffer (necesitas esta función auxiliar)
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Subir a S3 o guardar localmente
    const url = await this.storage.upload(`reportes/${reporteId}.pdf`, buffer);

    // Actualizar estado en BD
    await this.prisma.reporte.update({
      where: { id: reporteId },
      data: { estado: 'completado', urlPdf: url, fechaCompletado: new Date() },
    });
  }
}