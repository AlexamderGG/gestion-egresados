'use client';
import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import { HabilidadDemanda } from '@/types/dashboard';


export default function AdminDashboard() {
  const { data: kpis, isLoading: kpisLoading } = trpc.dashboard.getGlobalKpis.useQuery();
  const { data: ofertasVsPostulaciones } = trpc.dashboard.getOfertasVsPostulacionesMensual.useQuery({ anio: 2025 });
  const { data: habilidadesDemandadas } = trpc.dashboard.getDemandaHabilidades.useQuery<HabilidadDemanda[]>();

  if (kpisLoading) return <div>Cargando KPIs...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Egresados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.totalEgresados}</div>
          </CardContent>
        </Card>
        {/* Más tarjetas */}
      </div>

      <Card>
        <CardHeader><CardTitle>Ofertas vs Postulaciones (2025)</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ofertasVsPostulaciones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ofertas" stroke="#8884d8" />
              <Line type="monotone" dataKey="postulaciones" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top 10 Habilidades Demandadas</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {habilidadesDemandadas?.map(h => (
              <li key={h.habilidad_id} className="flex justify-between">
                <span>{h.habilidad_nombre}</span>
                <span>{h.cantidad_ofertas} ofertas</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}