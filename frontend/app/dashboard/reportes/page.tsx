// app/dashboard/egresados/page.tsx
'use client';
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/trpc';

interface Egresado {
  id: string;
  nombres: string;
  apellidos: string;
  carrera: string;
  anioEgreso: number;     // ← camelCase, como está en la BD/Prisma
}

export default function EgresadosPage() {
  const [search, setSearch] = useState('');
  const { data: egresados, isLoading } = trpc.egresados_list.useQuery<Egresado[]>(
    { carrera: search || undefined }
  );

  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o carrera..."
            className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nuevo egresado
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrera</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año egreso</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {egresados?.map((eg) => (
              <tr key={eg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {eg.nombres} {eg.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{eg.carrera}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{eg.anioEgreso}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button variant="ghost" size="sm" className="text-primary-600">Ver</Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}