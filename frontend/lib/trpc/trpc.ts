import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../backend/src/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:4000/trpc';
}

export function getHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
