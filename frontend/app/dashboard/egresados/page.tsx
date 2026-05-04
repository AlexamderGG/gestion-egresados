'use client';
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/trpc';
import { NuevoEgresadoModal } from './components/NuevoEgresadoModal';

interface Egresado {
  id: string;
  nombres: string;
  apellidos: string;
  carrera: string;
  anioEgreso: number;
}

export default function EgresadosPage() {
  const [search, setSearch] = useState('');
  const { data: egresados, isLoading, error, refetch } = trpc.egresados_list.useQuery<Egresado[]>(
    { carrera: search || undefined },
    { enabled: true } // se ejecuta automáticamente
  );

  if (isLoading) return <div className="p-8 text-center">Cargando egresados...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o carrera..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NuevoEgresadoModal onSuccess={() => refetch()} />
      </div>

      {/* Tabla de egresados (ya existente) */}
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">NOMBRES</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">CARRERA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">AÑO EGRESO</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {egresados?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay egresados registrados.
                </td>
              </tr>
            ) : (
              egresados?.map((eg) => (
                <tr key={eg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {eg.nombres} {eg.apellidos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{eg.carrera}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{eg.anioEgreso}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Button variant="ghost" size="sm">Ver</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}