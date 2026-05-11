'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc/trpc';
import { NuevoEgresadoModal } from './components/NuevoEgresadoModal';
import { toast } from 'sonner';

export default function EgresadosPage() {
  const [search, setSearch] = useState('');
  const { data: egresados, isLoading, refetch } = trpc.egresados_list.useQuery(
    { carrera: search || undefined },
    { enabled: true }
  );

  // Estados para modales
  const [modalVer, setModalVer] = useState<{ open: boolean; egresado: any }>({ open: false, egresado: null });
  const [modalEliminar, setModalEliminar] = useState<{ open: boolean; egresado: any }>({ open: false, egresado: null });

  const deleteMutation = trpc.egresados_delete.useMutation({
    onSuccess: () => {
      toast.success('Egresado eliminado');
      refetch();
      setModalEliminar({ open: false, egresado: null });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <div className="p-8 text-center">Cargando egresados...</div>;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón nuevo */}
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

      {/* Tabla */}
      <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden bg-white dark:bg-gray-900 shadow-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
           <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
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
              egresados?.map((eg: any) => (
                <tr key={eg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {eg.nombres} {eg.apellidos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{eg.carrera}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{eg.anioEgreso}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setModalVer({ open: true, egresado: eg })}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setModalEliminar({ open: true, egresado: eg })}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL VER DETALLES */}
      <Dialog open={modalVer.open} onOpenChange={(open) => setModalVer({ open, egresado: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del egresado</DialogTitle>
            <DialogDescription>
              Información completa del perfil.
            </DialogDescription>
          </DialogHeader>
          {modalVer.egresado && (
            <div className="space-y-3">
              <p><strong>Nombre completo:</strong> {modalVer.egresado.nombres} {modalVer.egresado.apellidos}</p>
              <p><strong>Email:</strong> {modalVer.egresado.user?.email}</p>
              <p><strong>Carrera:</strong> {modalVer.egresado.carrera || 'No especificada'}</p>
              <p><strong>Año de egreso:</strong> {modalVer.egresado.anioEgreso || '-'}</p>
              <p><strong>Teléfono:</strong> {modalVer.egresado.telefono || '-'}</p>
              <p><strong>Habilidades blandas:</strong> {modalVer.egresado.habilidadesBlandas || '-'}</p>
              <p><strong>Habilidades técnicas:</strong></p>
              <ul className="list-disc list-inside pl-4">
                {modalVer.egresado.habilidades?.map((h: any) => (
                  <li key={h.habilidadId}>
                    {h.habilidad?.nombre} - Nivel {h.nivel}
                  </li>
                ))}
              </ul>
              {modalVer.egresado.cvUrl && (
                <p><strong>CV:</strong> <a href={modalVer.egresado.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">Ver CV</a></p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVer({ open: false, egresado: null })}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <Dialog open={modalEliminar.open} onOpenChange={(open) => setModalEliminar({ open, egresado: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar egresado?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente a {modalEliminar.egresado?.nombres} {modalEliminar.egresado?.apellidos} y toda su información asociada. No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEliminar({ open: false, egresado: null })}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (modalEliminar.egresado) {
                  deleteMutation.mutate({ id: modalEliminar.egresado.id });
                }
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}