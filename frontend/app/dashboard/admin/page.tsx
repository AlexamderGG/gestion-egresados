// app/dashboard/admin/page.tsx
'use client';
import { trpc } from '@/lib/trpc/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const { data: kpis, isLoading: kpisLoading } = trpc.dashboard.getGlobalKpis.useQuery();
  const { data: evolucion } = trpc.dashboard.getOfertasVsPostulacionesMensual.useQuery({ anio: 2025 });
  const { data: habilidades } = trpc.dashboard.getDemandaHabilidades.useQuery();

  if (kpisLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpiCards = [
    { 
      title: 'Total Egresados', 
      value: kpis?.totalEgresados || 0, 
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'Empresas Registradas', 
      value: kpis?.totalEmpresas || 0, 
      icon: Building2, 
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      trend: '+5%',
      trendUp: true
    },
    { 
      title: 'Ofertas Activas', 
      value: kpis?.ofertasActivas || 0, 
      icon: Briefcase, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      trend: '-2%',
      trendUp: false
    },
    { 
      title: 'Tasa Empleabilidad', 
      value: `${kpis?.tasaEmpleabilidad || 0}%`, 
      icon: TrendingUp, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      trend: '+8%',
      trendUp: true
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="stat-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`h-3 w-3 ${kpi.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend} vs mes anterior
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de evolución */}
      <Card className="shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Ofertas vs Postulaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ofertas" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="postulaciones" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Habilidades más demandadas */}
      <Card className="shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Top Habilidades Demandadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habilidades?.slice(0, 5).map((h: any, index: number) => (
              <div key={h.habilidad_id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {h.habilidad_nombre}
                </span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((h.cantidad_ofertas / (habilidades?.[0]?.cantidad_ofertas || 1)) * 100, 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {h.cantidad_ofertas} ofertas
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}