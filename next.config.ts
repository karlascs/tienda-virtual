/**
 * ========================================
 * CONFIGURACIÓN DE NEXT.JS - IZA&CAS
 * ========================================
 * 
 * Configuración principal de Next.js 15 para el e-commerce.
 * Define optimizaciones, builds, imágenes y rutas.
 * 
 * Configuraciones clave:
 * - output: 'standalone' - Genera build optimizado para Docker/Railway
 * - Turbopack habilitado - Compilador rápido de Next.js
 * - ESLint deshabilitado en build - Para acelerar deployment
 * - Imágenes sin optimización - Compatibilidad con Railway
 * - Rewrites condicionales - Redirige API a backend Railway en desarrollo
 * 
 * @module next.config
 */

import type { NextConfig } from "next";

/**
 * Configuración de Next.js
 */
const nextConfig: NextConfig = {
  /**
   * Output standalone
   * Genera un build autocontenido con todas las dependencias
   * Óptimo para Docker, Railway y despliegues serverless
   */
  output: 'standalone',
  
  /**
   * ESLint
   * Ignorar errores de linting durante el build para acelerar deployment
   * ⚠️ Ejecutar `npm run lint` manualmente antes de hacer commit
   */
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  /**
   * Turbopack
   * Compilador de nueva generación (más rápido que Webpack)
   */
  turbopack: {
    root: process.cwd(),
  },
  
  /**
   * Extensiones de página
   * Define qué archivos se consideran páginas/routes
   */
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  /**
   * Paquetes externos del servidor
   * Especifica paquetes que no deben ser empaquetados por Webpack
   */
  serverExternalPackages: [],
  
  /**
   * Configuración de Imágenes
   * Optimizaciones para producción en Railway
   */
  images: {
    domains: ['localhost'],  // Dominios permitidos para imágenes externas
    unoptimized: true,       // Desactivar optimización automática (Railway)
  },
  
  /**
   * Optimizaciones Experimentales
   * Pre-importar paquetes comúnmente usados para mejorar rendimiento
   */
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  /**
   * Rewrites - Proxy de API
   * Redirige llamadas /api/* al backend de Railway cuando está configurado
   * 
   * Funcionamiento:
   * - En desarrollo: Si NEXT_PUBLIC_API_URL existe, redirige a Railway
   * - En producción: Usa el backend local de Next.js API Routes
   * - Excepciones: /api/auth/* (NextAuth) siempre se maneja localmente
   * 
   * @returns Array de reglas de rewrite
   */
  async rewrites() {
    // Solo aplicar rewrites si hay un backend externo configurado
    // (desarrollo local apuntando a Railway o Vercel apuntando a Railway)
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        // Redirigir requests de productos al backend Railway
        {
          source: '/api/products/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/products/:path*`,
        },
        // Redirigir requests de categorías al backend Railway
        {
          source: '/api/categories/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/categories/:path*`,
        },
        // Redirigir requests de carrito al backend Railway
        {
          source: '/api/cart/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/cart/:path*`,
        },
        // Redirigir requests de órdenes al backend Railway
        {
          source: '/api/orders/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/orders/:path*`,
        },
        // Redirigir requests de banners al backend Railway
        {
          source: '/api/banners/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/banners/:path*`,
        },
        // Redirigir health checks al backend Railway
        {
          source: '/api/health/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/health/:path*`,
        },
      ];
    }
    // Sin backend externo configurado, usar API Routes locales
    return [];
  },
};

export default nextConfig;

