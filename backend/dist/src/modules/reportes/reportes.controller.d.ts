import { ReportesService } from './reportes.service';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    solicitarReporte(req: any, body: {
        tipo: string;
        filtros: any;
    }): Promise<{
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReporte;
        tipoReporte: string;
        filtrosAplicados: import("@prisma/client/runtime/library").JsonValue | null;
        urlPdf: string | null;
        fechaSolicitud: Date;
        fechaCompletado: Date | null;
        usuarioId: string;
    }>;
    descargarReporte(id: string): Promise<{
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
