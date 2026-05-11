'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc/trpc';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Esquema de validación (activa es obligatorio, no tiene .default())
const ofertaSchema = z.object({
  titulo: z.string().min(1, 'Título requerido'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres'),
  ubicacion: z.string().optional(),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
  tipoContrato: z.string().optional(),
  salarioMin: z.coerce.number().positive().optional(),
  salarioMax: z.coerce.number().positive().optional(),
  activa: z.boolean(), // <-- Ahora es obligatorio
});

// Tipo inferido correctamente (activa es boolean, no opcional)
type OfertaForm = z.infer<typeof ofertaSchema>;

export function NuevaOfertaModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const createMutation = trpc.ofertas_create.useMutation({
    onSuccess: () => {
      toast.success('Oferta publicada');
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<OfertaForm>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      modalidad: 'remoto',
      activa: true, // <-- Se incluye obligatoriamente
    },
  });

  const onSubmit = (data: OfertaForm) => {
    // Los números ya se manejan con valueAsNumber, así que no es necesario convertirlos
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Nueva oferta</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Publicar nueva oferta</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input {...form.register('titulo')} />
            {form.formState.errors.titulo && (
              <p className="text-red-500 text-sm">{form.formState.errors.titulo.message}</p>
            )}
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea rows={4} {...form.register('descripcion')} />
            {form.formState.errors.descripcion && (
              <p className="text-red-500 text-sm">{form.formState.errors.descripcion.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ubicación</Label>
              <Input {...form.register('ubicacion')} placeholder="Ciudad, país" />
            </div>
            <div>
              <Label>Modalidad</Label>
              <Select
                value={form.watch('modalidad')}
                onValueChange={(val) => form.setValue('modalidad', val as 'remoto' | 'hibrido' | 'presencial')}
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
              <Label>Salario mínimo (USD)</Label>
              <Input type="number" {...form.register('salarioMin', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Salario máximo (USD)</Label>
              <Input type="number" {...form.register('salarioMax', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}