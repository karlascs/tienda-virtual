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
  
  // Configuración de imágenes para producción
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // Optimizaciones para producción
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // Rewrites para API en Railway (solo cuando NO esté en modo standalone)
  async rewrites() {
    // En desarrollo o Vercel, redirigir API calls a Railway
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

