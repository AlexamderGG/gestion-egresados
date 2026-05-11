// app/dashboard/ofertas/components/EditarOfertaModal.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc/trpc';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Esquema con activa como obligatorio
const ofertaSchema = z.object({
  titulo: z.string().min(1, 'Título requerido'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres'),
  ubicacion: z.string().optional(),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
  tipoContrato: z.string().optional(),
  salarioMin: z.coerce.number().positive().optional(),
  salarioMax: z.coerce.number().positive().optional(),
  vacantes: z.coerce.number().int().positive().min(1, 'Mínimo 1 vacante'),
  activa: z.boolean(),
});

type OfertaForm = z.infer<typeof ofertaSchema>;

export function EditarOfertaModal({ oferta, open, onOpenChange, onSuccess }: any) {
  const [isLoading, setIsLoading] = useState(false);
  
  const updateMutation = trpc.ofertas_update.useMutation({
    onSuccess: () => {
      toast.success('Oferta actualizada correctamente');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setIsLoading(false),
  });

  const form = useForm<OfertaForm>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      titulo: oferta.titulo,
      descripcion: oferta.descripcion,
      ubicacion: oferta.ubicacion || '',
      modalidad: oferta.modalidad,
      tipoContrato: oferta.tipoContrato || '',
      salarioMin: oferta.salarioMin || undefined,
      salarioMax: oferta.salarioMax || undefined,
      vacantes: oferta.vacantes || 1,
      activa: oferta.activa ?? true, // Asegurar que tenga valor
    },
  });

  const onSubmit = (data: OfertaForm) => {
    setIsLoading(true);
    updateMutation.mutate({ id: oferta.id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar oferta: {oferta.titulo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título</Label>
              <Input {...form.register('titulo')} />
              {form.formState.errors.titulo && (
                <p className="text-red-500 text-sm">{form.formState.errors.titulo.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Descripción</Label>
              <Textarea rows={4} {...form.register('descripcion')} />
              {form.formState.errors.descripcion && (
                <p className="text-red-500 text-sm">{form.formState.errors.descripcion.message}</p>
              )}
            </div>
            <div>
              <Label>Ubicación</Label>
              <Input {...form.register('ubicacion')} placeholder="Ciudad, país" />
            </div>
            <div>
              <Label>Modalidad</Label>
              <Select
                value={form.watch('modalidad')}
                onValueChange={(v) => form.setValue('modalidad', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.modalidad && (
                <p className="text-red-500 text-sm">{form.formState.errors.modalidad.message}</p>
              )}
            </div>
            <div>
              <Label>Tipo de contrato</Label>
              <Input {...form.register('tipoContrato')} placeholder="Tiempo completo, Freelance..." />
            </div>
            <div>
              <Label>N° de vacantes</Label>
              <Input type="number" {...form.register('vacantes')} />
              {form.formState.errors.vacantes && (
                <p className="text-red-500 text-sm">{form.formState.errors.vacantes.message}</p>
              )}
            </div>
            <div>
              <Label>Salario mínimo (USD)</Label>
              <Input type="number" {...form.register('salarioMin')} />
            </div>
            <div>
              <Label>Salario máximo (USD)</Label>
              <Input type="number" {...form.register('salarioMax')} />
            </div>
            <div className="col-span-2">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.watch('activa')}
                  onChange={(e) => form.setValue('activa', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Oferta activa
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}