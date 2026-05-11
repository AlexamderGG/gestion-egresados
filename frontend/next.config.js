// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,  // ← Ignora errores de TypeScript durante el build
  },
  eslint: {
    ignoreDuringBuilds: true, // ← Ignora errores de ESLint durante el build
  },
}

module.exports = nextConfig