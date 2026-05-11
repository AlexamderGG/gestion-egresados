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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Habilidad {
  id: string;
  nombre: string;
  categoria: 'tecnica' | 'blanda';
}

const habilidadSchema = z.object({
  habilidadId: z.string(),
  nivel: z.number().min(1).max(5)
});

const egresadoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número'),
  nombres: z.string().min(1, 'Nombres requeridos'),
  apellidos: z.string().min(1, 'Apellidos requeridos'),
  telefono: z.string().optional(),
  carrera: z.string().min(1, 'Carrera requerida'),
  anioEgreso: z.number().int().min(1900).max(new Date().getFullYear()),
  cvUrl: z.string().url().optional().or(z.literal('')),
  habilidadesBlandas: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  habilidades: z.array(habilidadSchema).min(1, 'Seleccione al menos una habilidad')
});

type EgresadoForm = z.infer<typeof egresadoSchema>;

export function NuevoEgresadoModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { data: habilidades } = trpc.habilidades_list.useQuery<Habilidad[]>();
  const createMutation = trpc.egresados_create.useMutation({
    onSuccess: () => {
      toast.success('Egresado creado exitosamente');
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => toast.error(error.message)
  });

  const form = useForm<EgresadoForm>({
    resolver: zodResolver(egresadoSchema),
    defaultValues: { habilidades: [] }
  });

  const onSubmit = (data: EgresadoForm) => {
    console.log('Datos enviados:', data);  // <-- agregar esta línea
    createMutation.mutate({
      ...data,
      email: data.email,
      password: data.password,
      nombres: data.nombres,
      apellidos: data.apellidos,
      telefono: data.telefono,
      carrera: data.carrera,
      anioEgreso: Number(data.anioEgreso),
      cvUrl: data.cvUrl || undefined,
      habilidadesBlandas: data.habilidadesBlandas,
      fechaNacimiento: data.fechaNacimiento, // ← string directamente (ej. "1990-01-01")
      habilidades: data.habilidades.map(h => ({ habilidadId: h.habilidadId, nivel: h.nivel })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-bg text-white shadow-md hover:shadow-lg transition-all duration-300">
          + Nuevo egresado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar egresado</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombres</Label>
              <Input {...form.register('nombres')} />
              {form.formState.errors.nombres && <p className="text-red-500 text-sm">{form.formState.errors.nombres.message}</p>}
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input {...form.register('apellidos')} />
              {form.formState.errors.apellidos && <p className="text-red-500 text-sm">{form.formState.errors.apellidos.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" {...form.register('password')} />
              {form.formState.errors.password && 
                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>}
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input {...form.register('telefono')} />
              {form.formState.errors.telefono && <p className="text-red-500 text-sm">{form.formState.errors.telefono.message}</p>}
            </div>
            <div>
              <Label>Carrera</Label>
              <Input {...form.register('carrera')} />
              {form.formState.errors.carrera && <p className="text-red-500 text-sm">{form.formState.errors.carrera.message}</p>}
            </div>
            <div>
              <Label>Año de egreso</Label>
              <Input type="number" {...form.register('anioEgreso', { valueAsNumber: true })} />
              {form.formState.errors.anioEgreso && <p className="text-red-500 text-sm">{form.formState.errors.anioEgreso.message}</p>}
            </div>
            <div>
              <Label>URL del CV</Label>
              <Input {...form.register('cvUrl')} placeholder="https://..." />
              {form.formState.errors.cvUrl && <p className="text-red-500 text-sm">{form.formState.errors.cvUrl.message}</p>}
            </div>
            <div className="col-span-2">
              <Label>Habilidades blandas</Label>
              <Input {...form.register('habilidadesBlandas')} />
              {form.formState.errors.habilidadesBlandas && <p className="text-red-500 text-sm">{form.formState.errors.habilidadesBlandas.message}</p>}
            </div>
            <div className="col-span-2">
              <Label>Fecha de nacimiento</Label>
              <Input type="date" {...form.register('fechaNacimiento')} />
              {form.formState.errors.fechaNacimiento && <p className="text-red-500 text-sm">{form.formState.errors.fechaNacimiento.message}</p>}
            </div>
          </div>
          {/* Habilidades técnicas */}
          <div>
            <Label>Habilidades técnicas</Label>
            <div className="flex flex-wrap gap-3 mt-1">
              {habilidades?.filter(h => h.categoria === 'tecnica').map(h => {
                const habIndex = form.watch('habilidades').findIndex(hab => hab.habilidadId === h.id);
                const selected = habIndex !== -1;
                return (
                  <div key={h.id} className="flex items-center space-x-2">
                    <Checkbox
                    checked={selected}
                    onCheckedChange={(checked: boolean | "indeterminate") => {
                        const isChecked = checked === true;
                        if (isChecked) {
                        form.setValue('habilidades', [...form.getValues('habilidades'), { habilidadId: h.id, nivel: 3 }]);
                        } else {
                        form.setValue('habilidades', form.getValues('habilidades').filter(hab => hab.habilidadId !== h.id));
                        }
                    }}
                    />
                    <span className="text-sm">{h.nombre}</span>
                    {selected && (
                      <Select
                        value={String(form.watch(`habilidades.${habIndex}.nivel`) || 3)}
                        onValueChange={(val) => {
                          const updated = [...form.getValues('habilidades')];
                          updated[habIndex] = { ...updated[habIndex], nivel: parseInt(val) };
                          form.setValue('habilidades', updated);
                        }}
                      >
                        <SelectTrigger className="w-20 ml-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Básico</SelectItem>
                          <SelectItem value="2">Intermedio</SelectItem>
                          <SelectItem value="3">Avanzado</SelectItem>
                          <SelectItem value="4">Experto</SelectItem>
                          <SelectItem value="5">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>
            {form.formState.errors.habilidades && <p className="text-red-500 text-sm">{form.formState.errors.habilidades.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'Creando...' : 'Crear egresado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}