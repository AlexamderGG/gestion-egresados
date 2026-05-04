import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "./providers";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestión de Egresados",
  description: "Plataforma de gestión de egresados y ofertas laborales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
