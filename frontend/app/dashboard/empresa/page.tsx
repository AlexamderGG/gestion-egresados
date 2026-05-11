// app/dashboard/empresa/page.tsx
'use client';
import { trpc } from '@/lib/trpc/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

export default function EmpresaDashboard() {
  const { data: user } = trpc.auth.getMe.useQuery();
  const { data: ofertas } = trpc.ofertas_mis_ofertas.useQuery();
  const { data: postulaciones } = trpc.postulaciones_mis_ofertas.useQuery();

  const ofertasActivas = ofertas?.filter(o => o.activa).length || 0;
  const postulacionesPendientes = postulaciones?.filter(p => p.estado === 'postulado').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Empresa</h1>
        <p className="text-gray-500">Bienvenido, {user?.email}</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ofertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ofertas?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ofertasActivas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postulaciones?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{postulacionesPendientes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Mis Ofertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Gestiona tus ofertas laborales</p>
            <Link href="/dashboard/ofertas">
              <Button variant="outline" className="w-full">Ver ofertas</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Postulaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Revisa y gestiona candidatos</p>
            <Link href="/dashboard/empresa/postulaciones">
              <Button variant="outline" className="w-full">Ver postulaciones</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints necesarios en el backend */}
      {!ofertas && <p className="text-sm text-gray-400 text-center">Cargando datos...</p>}
    </div>
  );
}