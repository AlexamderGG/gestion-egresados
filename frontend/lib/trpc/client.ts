import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

// Crear una función para inicializar el cliente
let clientInstance: any = null;

export const getTrpcClient = () => {
  if (!clientInstance) {
    clientInstance = createTRPCClient<AnyRouter>({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:4000/trpc',
          headers: () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    });
  }
  return clientInstance;
};