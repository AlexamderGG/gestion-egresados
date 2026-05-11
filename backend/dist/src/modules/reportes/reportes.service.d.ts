import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
export declare class ReportesService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    solicitarReporte(usuarioId: string, tipo: string, filtros: any): Promise<{
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReporte;
        tipoReporte: string;
        filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
        urlPdf: string | null;
        fechaSolicitud: Date;
        fechaCompletado: Date | null;
        usuarioId: string;
    }>;
    private generarReporte;
    private generarHTML;
    listarReportes(usuarioId: string): Promise<{
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReporte;
        tipoReporte: string;
        filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
        urlPdf: string | null;
        fechaSolicitud: Date;
        fechaCompletado: Date | null;
        usuarioId: string;
    }[]>;
    descargarReporte(reporteId: string): Promise<{
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReporte;
        tipoReporte: string;
        filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
        urlPdf: string | null;
        fechaSolicitud: Date;
        fechaCompletado: Date | null;
        usuarioId: string;
    }>;
}
