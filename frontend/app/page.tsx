// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si hay token, redirigir al dashboard
      router.push('/dashboard');
    } else {
      // Si no hay token, redirigir al login
      router.push('/login');
    }
  }, [router]);

  // Mostrar loading mientras redirige
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}