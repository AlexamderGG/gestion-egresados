// app/dashboard/layout.tsx
'use client';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Users, Briefcase, BarChart3, FileText, LogOut,
  Building2, UserCheck, Menu, X, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/trpc';
import { useTheme } from 'next-themes';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = trpc.auth.getMe.useQuery();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getNavItems = () => {
    const commonItems = [
      { href: '/dashboard', label: 'Inicio', icon: Home, roles: ['admin', 'egresado', 'empresa'], color: 'text-blue-500' },
    ];

    const roleSpecificItems = {
      admin: [
        { href: '/dashboard/egresados', label: 'Egresados', icon: Users, color: 'text-green-500' },
        { href: '/dashboard/ofertas', label: 'Ofertas', icon: Briefcase, color: 'text-orange-500' },
        { href: '/dashboard/analitica', label: 'Analítica', icon: BarChart3, color: 'text-purple-500' },
        { href: '/dashboard/reportes', label: 'Reportes', icon: FileText, color: 'text-red-500' },
      ],
      egresado: [
        { href: '/dashboard/ofertas', label: 'Ofertas', icon: Briefcase, color: 'text-orange-500' },
        { href: '/dashboard/mis-postulaciones', label: 'Mis Postulaciones', icon: UserCheck, color: 'text-green-500' },
      ],
      empresa: [
        { href: '/dashboard/ofertas', label: 'Mis Ofertas', icon: Briefcase, color: 'text-orange-500' },
        { href: '/dashboard/empresa/postulaciones', label: 'Postulaciones', icon: Users, color: 'text-blue-500' },
      ],
    };

    return [...commonItems, ...roleSpecificItems[user.role as keyof typeof roleSpecificItems]];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar para desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-200/50 dark:border-gray-700/50",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E+</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Egresados+
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "gradient-bg text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : item.color)} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 glass-effect shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
              <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}