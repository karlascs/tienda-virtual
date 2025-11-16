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
    // EXCEPTO las rutas de NextAuth que deben quedarse en Vercel
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/products/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/products/:path*`,
        },
        {
          source: '/api/categories/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/categories/:path*`,
        },
        {
          source: '/api/cart/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/cart/:path*`,
        },
        {
          source: '/api/orders/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/orders/:path*`,
        },
        {
          source: '/api/banners/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/banners/:path*`,
        },
        {
          source: '/api/health/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/health/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

