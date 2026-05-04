declare class HabilidadDto {
    habilidadId: string;
    nivel: number;
}
export declare class CreateEgresadoDto {
    nombres: string;
    apellidos: string;
    telefono?: string;
    carrera: string;
    anio_egreso: number;
    cv_url?: string;
    habilidades_blandas?: string;
    fecha_nacimiento?: Date;
    habilidades: HabilidadDto[];
}
export {};
