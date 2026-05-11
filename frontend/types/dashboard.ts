export interface GlobalKpis {
  totalEgresados: number;
  totalEmpresas: number;
  totalOfertas: number;
  totalPostulaciones: number;
  tasaEmpleabilidad: number;
  ofertasActivas: number;
}

export interface OfertasVsPostulacionesMensual {
  mes: string;
  ofertas: number;
  postulaciones: number;
}

export interface HabilidadDemanda {
  habilidad_id: string;
  habilidad_nombre: string;
  cantidad_ofertas: number;
  cantidad_egresados: number;
  porcentaje_demanda: number;
}

export interface EmpleabilidadPorCarrera {
  carrera: string;
  anio: number;
  total_egresados: number;
  empleados: number;
  tasa_empleabilidad: number;
}

export interface HabilidadDemandada {
  habilidad_id: string;
  habilidad_nombre: string;
  cantidad_ofertas: number;
  cantidad_egresados: number;
  porcentaje_demanda: number;
}