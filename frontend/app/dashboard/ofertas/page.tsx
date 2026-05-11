'use client';
import { useState } from 'react';
import { Search, Plus, Building2, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc/trpc';
import { NuevaOfertaModal } from './components/NuevaOfertaModal';
import { PostularModal } from './components/PostularModal';
import { toast } from 'sonner';
import { EditarOfertaModal } from './components/EditarOfertaModal';
import { Pencil } from 'lucide-react';

export default function OfertasPage() {
  const [search, setSearch] = useState('');
  const [modalidad, setModalidad] = useState<string>('todas');
  const [selectedOferta, setSelectedOferta] = useState<any>(null);
  const [postularOpen, setPostularOpen] = useState(false);
  const { data: user } = trpc.auth.getMe.useQuery();
  const [editingOferta, setEditingOferta] = useState<any>(null);
  
  const { data: ofertas, isLoading, refetch } = trpc.ofertas_list.useQuery({
    titulo: search || undefined,
    modalidad: modalidad === 'todas' ? undefined : modalidad,
  });

  const deleteMutation = trpc.ofertas_delete.useMutation({
    onSuccess: () => {
      toast.success('Oferta eliminada');
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const handlePostular = (oferta: any) => {
    setSelectedOferta(oferta);
    setPostularOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center">Cargando ofertas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por título..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={modalidad} onValueChange={setModalidad}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="remoto">Remoto</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {user?.role === 'empresa' && (
          <NuevaOfertaModal onSuccess={refetch} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ofertas?.map((oferta) => (
          <Card key={oferta.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{oferta.titulo}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3" />
                    {oferta.empresa?.nombreEmpresa || 'Empresa'}
                  </CardDescription>
                </div>
                <Badge variant={oferta.activa ? 'default' : 'secondary'}>
                  {oferta.activa ? 'Activa' : 'Cerrada'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 line-clamp-2">{oferta.descripcion}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {oferta.ubicacion || 'No especificada'}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {oferta.modalidad}
                </Badge>
                {oferta.salarioMin && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {oferta.salarioMin} - {oferta.salarioMax}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {oferta.habilidades?.map((h: any) => (
                  <Badge key={h.habilidadId} className="bg-gray-100 text-gray-800">
                    {h.habilidad?.nombre}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-gray-500">
                Publicado: {new Date(oferta.fechaPublicacion).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                {user?.role === 'egresado' && (
                  <Button size="sm" onClick={() => handlePostular(oferta)}>
                    Postular
                  </Button>
                )}
                {user?.role === 'empresa' && oferta.empresaId === user?.id && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingOferta(oferta)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate({ id: oferta.id })}
                  >
                    Eliminar
                  </Button>
                </div>
                )}
                {editingOferta && (
                  <EditarOfertaModal
                    oferta={editingOferta}
                    open={!!editingOferta}
                    onOpenChange={() => setEditingOferta(null)}
                    onSuccess={() => refetch()}
                  />
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
        {ofertas?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay ofertas que coincidan con los filtros.
          </div>
        )}
      </div>

      {selectedOferta && (
        <PostularModal
          open={postularOpen}
          onOpenChange={setPostularOpen}
          oferta={selectedOferta}
          onSuccess={() => {
            toast.success('Postulación enviada');
            refetch();
          }}
        />
      )}
    </div>
  );
}