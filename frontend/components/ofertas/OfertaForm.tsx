// components/ofertas/OfertaForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { z } from 'zod';

const ofertaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
  tipoContrato: z.string().optional(),
  ubicacion: z.string().optional(),
  salarioMin: z.number().positive().optional(),
  salarioMax: z.number().positive().optional(),
  empresaId: z.string().uuid('ID de empresa inválido'),
  habilidades: z.array(z.string()).optional(),
  fechaCierre: z.date().optional(),
});

type OfertaFormData = z.infer<typeof ofertaSchema>;


interface OfertaFormProps {
  defaultValues?: any; // O mejor, define un tipo específico para la oferta
  onSubmit: (data: any) => void | Promise<void>;
}
export function OfertaForm({ defaultValues, onSubmit }: OfertaFormProps) {
  const form = useForm({
    resolver: zodResolver(ofertaSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título de la oferta *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Desarrollador Full Stack" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modalidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700">Publicar oferta</Button>
        </div>
      </form>
    </Form>
  )
}