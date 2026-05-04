// frontend/app/page.tsx
export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Bienvenido al Sistema de Gestión de Egresados</h1>
        <p className="mt-4 text-lg">El servidor Next.js está funcionando correctamente.</p>
        <p className="mt-2">Accede al <a href="/dashboard" className="text-blue-600 underline">dashboard</a></p>
      </div>
    </div>
  );
}