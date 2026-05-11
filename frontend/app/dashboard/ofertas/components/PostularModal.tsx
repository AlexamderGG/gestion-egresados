'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/trpc';
import { toast } from 'sonner';

export function PostularModal({ open, onOpenChange, oferta, onSuccess }: any) {
  const [comentario, setComentario] = useState('');
  const postularMutation = trpc.ofertas_postular.useMutation({
    onSuccess: () => {
      toast.success('Postulación enviada correctamente');
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const handlePostular = () => {
    postularMutation.mutate({ ofertaId: oferta.id, comentario });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postular a: {oferta.titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Cuéntanos por qué eres el candidato ideal..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handlePostular} disabled={postularMutation.isLoading}>
              Enviar postulación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}