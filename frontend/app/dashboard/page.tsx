'use client';
import { trpc } from '@/lib/trpc/trpc';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardHome() {
  const router = useRouter();
  const { data: user, isLoading } = trpc.auth.getMe.useQuery();

  useEffect(() => {
    if (!isLoading) {
      if (user?.role === 'admin') router.push('/dashboard/admin');
      else if (user?.role === 'egresado') router.push('/dashboard/ofertas');
      else if (user?.role === 'empresa') router.push('/dashboard/empresa');
      else router.push('/login');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
      </div>
    </div>
  );
}