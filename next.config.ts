import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  // Asegurar que Next.js use el directorio src/
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Configuración actualizada para Next.js 15
  serverExternalPackages: [],
  // Configuración para Docker (standalone output)
  output: 'standalone',
  
  // Configuración de imágenes para producción (Railway)
  images: {
    domains: ['localhost'],
    unoptimized: true, // Necesario para Railway y static export
  },
  
  // Optimizaciones para producción
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
};

export default nextConfig;

