// app/dashboard/layout.tsx
'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Briefcase, 
  BarChart3, 
  FileText, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/egresados', label: 'Egresados', icon: Users },
  { href: '/dashboard/ofertas', label: 'Ofertas', icon: Briefcase },
  { href: '/dashboard/analitica', label: 'Analítica', icon: BarChart3 },
  { href: '/dashboard/reportes', label: 'Reportes', icon: FileText },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Aquí implementarías logout (limpiar token, etc.)
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - escritorio */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 bg-white border-r shadow-sm z-20">
        <div className="flex items-center h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary-700">Egresados+</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="md:ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b h-16 flex items-center justify-between px-6 z-10">
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <span className="sr-only">Abrir menú</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            {/* Aquí puedes agregar notificaciones y perfil */}
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">A</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}