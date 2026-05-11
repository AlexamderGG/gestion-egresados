// app/dashboard/empresa/postulaciones/page.tsx
'use client';
import { trpc } from '@/lib/trpc/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const estados = ['postulado', 'revision', 'entrevista', 'contratado', 'rechazado'];

const getEstadoColor = (estado: string) => {
  const colors = {
    postulado: 'bg-yellow-500',
    revision: 'bg-blue-500',
    entrevista: 'bg-purple-500',
    contratado: 'bg-green-500',
    rechazado: 'bg-red-500',
  };
  return colors[estado as keyof typeof colors] || 'bg-gray-500';
};

const getEstadoTexto = (estado: string) => {
  const textos = {
    postulado: '📋 Postulado',
    revision: '🔍 En revisión',
    entrevista: '🎯 Entrevista',
    contratado: '✅ Contratado',
    rechazado: '❌ Rechazado',
  };
  return textos[estado as keyof typeof textos] || estado;
};

export default function PostulacionesPage() {
  const { data: postulaciones, refetch } = trpc.postulaciones_mis_ofertas.useQuery();
  const updateMutation = trpc.postulaciones_actualizar_estado.useMutation({
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCambiarEstado = (postulacionId: string, nuevoEstado: string) => {
    updateMutation.mutate({ postulacionId, estado: nuevoEstado as any });
  };

  if (!postulaciones) {
    return <div className="p-8 text-center">Cargando postulaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Postulaciones</h1>
        <p className="text-gray-500">Revisa y actualiza el estado de los candidatos</p>
      </div>

      {postulaciones.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay postulaciones para tus ofertas.
        </div>
      ) : (
        <div className="grid gap-4">
          {postulaciones.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>{post.oferta.titulo}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Vacantes: {post.oferta.vacantesCubiertas} / {post.oferta.vacantes}
                    </p>
                  </div>
                  <Badge className={getEstadoColor(post.estado)}>
                    {getEstadoTexto(post.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm">
                      <strong>Candidato:</strong> {post.egresado.nombres} {post.egresado.apellidos}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {post.egresado.user.email}
                    </p>
                    <p className="text-sm">
                      <strong>Carrera:</strong> {post.egresado.carrera}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Postulado:</strong> {new Date(post.fechaPostulacion).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>Comentario:</strong> {post.comentario || 'Sin comentario'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm font-medium">Cambiar estado:</span>
                  <Select
                    value={post.estado}
                    onValueChange={(val) => handleCambiarEstado(post.id, val)}
                    disabled={updateMutation.isLoading}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {getEstadoTexto(estado)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}