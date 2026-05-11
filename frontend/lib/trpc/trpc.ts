// Sin importar el backend - usar any
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact();

export function getBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/trpc`;
  }
  return process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:4000/trpc';
}

export function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}