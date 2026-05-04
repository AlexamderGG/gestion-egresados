export interface KpiResult {
  totalEgresados: number;
  totalEmpresas: number;
  ofertasActivas: number;
  tasaEmpleabilidad: any; // Ajusta según la estructura real que devuelve tu consulta
}

export interface OfertaDemandaMensual {
  mes: number;
  ofertas: number;
  postulaciones: number;
}