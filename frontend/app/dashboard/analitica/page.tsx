'use client';
import { trpc } from '@/lib/trpc/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnaliticaPage() {
  // Consultas a los endpoints
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = trpc.dashboard.getGlobalKpis.useQuery();
  const { data: egresadosPorCarrera, isLoading: carreraLoading, error: carreraError } = trpc.analitica.getEgresadosPorCarrera.useQuery();
  const { data: evolucionPostulaciones, isLoading: evolucionLoading, error: evolucionError } = trpc.analitica.getEvolucionPostulaciones.useQuery();
  const { data: habilidadesDemandadas, isLoading: habilidadesLoading } = trpc.dashboard.getDemandaHabilidades.useQuery();
  const { data: empleabilidadPorCarrera, isLoading: empleabilidadLoading } = trpc.analitica.getEmpleabilidadPorCarrera.useQuery();

  // Estado de carga general
  if (kpisLoading || carreraLoading || evolucionLoading || habilidadesLoading || empleabilidadLoading) {
    return <div className="p-8 text-center">Cargando datos...</div>;
  }

  // Manejo de errores
  if (kpisError || carreraError || evolucionError) {
  console.error('Errores detallados:', { kpisError, carreraError, evolucionError });
  return <div className="p-8 text-red-600">Error: {kpisError?.message || carreraError?.message || evolucionError?.message || 'Error desconocido'}</div>;
}
  // Preparar datos para gráficos (asegurar que sean arrays)
  const egresadosData = egresadosPorCarrera || [];
  const evolucionData = evolucionPostulaciones || [];
  const habilidadesData = Array.isArray(habilidadesDemandadas) ? habilidadesDemandadas : [];
  const empleabilidadData = empleabilidadPorCarrera || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analítica Avanzada</h1>
        <p className="text-gray-500">Métricas detalladas y tendencias del ecosistema</p>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Egresados</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.totalEgresados || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Empresas Activas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.totalEmpresas || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ofertas Activas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.ofertasActivas || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tasa Empleabilidad</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{kpis?.tasaEmpleabilidad || 0}%</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Egresados por carrera */}
        <Card>
          <CardHeader><CardTitle>Egresados por Carrera</CardTitle><CardDescription>Distribución de egresados según su especialidad</CardDescription></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={egresadosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="carrera" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolución de postulaciones */}
        <Card>
          <CardHeader><CardTitle>Evolución de Postulaciones</CardTitle><CardDescription>Últimos 12 meses</CardDescription></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="postulaciones" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habilidades más demandadas */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Habilidades Demandadas</CardTitle>
            <CardDescription>Porcentaje de ofertas que requieren cada habilidad</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {Array.isArray(habilidadesData) && habilidadesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={habilidadesData.slice(0,5)} 
                    dataKey="cantidad_ofertas" 
                    nameKey="habilidad_nombre" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {habilidadesData.slice(0,5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No hay datos de habilidades disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empleabilidad por carrera */}
        <Card>
          <CardHeader><CardTitle>Empleabilidad por Carrera</CardTitle><CardDescription>Porcentaje de egresados contratados</CardDescription></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={empleabilidadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="carrera" type="category" width={100} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="tasa_empleabilidad" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}