'use client';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Download, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definir el tipo de Reporte para evitar la recursión infinita
interface Reporte {
  id: string;
  tipoReporte: string;
  filtrosAplicados: Record<string, any> | null;
  urlPdf: string | null;
  estado: 'en_cola' | 'procesando' | 'completado' | 'error';
  fechaSolicitud: string | Date;
  fechaCompletado: string | Date | null;
  usuarioId: string;
}

const REPORT_TYPES = [
  { value: 'empleabilidad', label: 'Reporte de Empleabilidad' },
  { value: 'ofertas_activas', label: 'Ofertas Activas' },
  { value: 'demanda_habilidades', label: 'Demanda de Habilidades' },
];

export default function ReportesPage() {
  const [tipo, setTipo] = useState('empleabilidad');
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '' });
  
  const solicitarMutation = trpc.reportes.solicitar.useMutation();
  // 👇 Tipar explícitamente la respuesta
// En lugar de tipar con <Reporte[]>, usa as
  const { data: reportes, refetch } = trpc.reportes.listar.useQuery() as { data: Reporte[] | undefined; refetch: () => void };

  const handleGenerar = async () => {
    try {
      await solicitarMutation.mutateAsync({ tipo, filtros });
      toast.success('Reporte solicitado. Se generará en breve.');
      refetch();
    } catch (error) {
      toast.error('Error al solicitar el reporte');
    }
  };

  const handleDescargar = (reporte: Reporte) => {
  if (reporte.urlPdf) {
    // Si la URL termina en .html, abrir como HTML
    window.open(reporte.urlPdf, '_blank');
  } else {
    toast.error('El reporte aún no está listo');
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generación de Reportes</h1>
        <p className="text-gray-500">Selecciona el tipo de reporte y los filtros para generar un documento PDF</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulario de generación */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Reporte</CardTitle>
            <CardDescription>Configura los parámetros del reporte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha Desde (opcional)</Label>
              <Input 
                type="date" 
                value={filtros.fechaDesde} 
                onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Hasta (opcional)</Label>
              <Input 
                type="date" 
                value={filtros.fechaHasta} 
                onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })} 
              />
            </div>
            <Button 
              onClick={handleGenerar} 
              disabled={solicitarMutation.isLoading} 
              className="w-full"
            >
              {solicitarMutation.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        {/* Lista de reportes generados */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Generados</CardTitle>
            <CardDescription>Historial de reportes solicitados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(!reportes || reportes.length === 0) && (
                <p className="text-center text-gray-500 py-8">No hay reportes generados aún</p>
              )}
              {reportes?.map((reporte) => (
                <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {REPORT_TYPES.find(t => t.value === reporte.tipoReporte)?.label || reporte.tipoReporte}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(reporte.fechaSolicitud), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                    </p>
                    <p className="text-xs text-gray-400">
                      Estado: {reporte.estado === 'completado' ? '✅ Listo' : reporte.estado === 'en_cola' ? '⏳ En cola' : '🔄 Generando...'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDescargar(reporte)} 
                    disabled={reporte.estado !== 'completado'}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}