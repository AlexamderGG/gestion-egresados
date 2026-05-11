'use client';
import { trpc } from '@/lib/trpc/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default function MisPostulacionesPage() {
  const { data: user } = trpc.auth.getMe.useQuery();
  const { data: postulaciones } = trpc.postulaciones_mis_postulaciones.useQuery();

  if (user?.role !== 'egresado') {
    return <div>No tienes acceso a esta página</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis Postulaciones</h1>
        <p className="text-gray-500">Seguimiento de tus postulaciones a ofertas laborales</p>
      </div>

      {postulaciones?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No te has postulado a ninguna oferta aún.
        </div>
      ) : (
        <div className="grid gap-4">
          {postulaciones?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{post.oferta.titulo}</CardTitle>
                  <Badge className={getEstadoColor(post.estado)}>
                    {post.estado.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{post.oferta.descripcion?.substring(0, 200)}...</p>
                <div className="mt-3 grid gap-1 text-sm">
                  <p><strong>Empresa:</strong> {post.oferta.empresa?.nombreEmpresa}</p>
                  <p><strong>Modalidad:</strong> {post.oferta.modalidad}</p>
                  <p><strong>Fecha postulación:</strong> {new Date(post.fechaPostulacion).toLocaleDateString()}</p>
                  {post.comentario && <p><strong>Tu comentario:</strong> {post.comentario}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}