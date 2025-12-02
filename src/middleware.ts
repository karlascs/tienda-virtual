/**
 * ========================================
 * MIDDLEWARE DE SEGURIDAD - IZA&CAS
 * ========================================
 * 
 * Middleware de Next.js que se ejecuta antes de cada request.
 * Aplica headers de seguridad HTTP y puede implementar protección de rutas.
 * 
 * Funciones principales:
 * - Aplicar headers de seguridad (X-Frame-Options, CSP, HSTS, etc.)
 * - Prevenir ataques XSS, Clickjacking y MIME sniffing
 * - Habilitar HSTS solo en producción
 * 
 * Headers aplicados:
 * - X-Frame-Options: SAMEORIGIN - Previene clickjacking
 * - X-Content-Type-Options: nosniff - Previene MIME sniffing
 * - Referrer-Policy: origin-when-cross-origin - Control de referrer
 * - Strict-Transport-Security: HSTS (solo producción)
 * 
 * @module middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware principal
 * Se ejecuta en cada request a rutas configuradas en matcher
 * 
 * @param request - Request de Next.js
 * @returns Response con headers de seguridad aplicados
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Identificar tipo de ruta (para futuras implementaciones)
  const isAdminRoute = path.startsWith("/admin");    // Rutas de administración
  const isProfileRoute = path.startsWith("/profile"); // Rutas de perfil de usuario
  
  // Crear respuesta base (continuar con el request)
  let response = NextResponse.next();

  /**
   * 🔒 HEADERS DE SEGURIDAD HTTP
   * Conjunto esencial de headers para protección web
   */
  const securityHeaders: Record<string, string> = {
    // Previene que la página se muestre en iframe desde otros dominios (previene clickjacking)
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Previene que navegadores "adivinen" el tipo MIME (previene MIME sniffing attacks)
    'X-Content-Type-Options': 'nosniff',
    
    // Controla cuánta información de referencia se envía en requests
    'Referrer-Policy': 'origin-when-cross-origin',
  };

  /**
   * HSTS (HTTP Strict Transport Security)
   * Solo en producción - fuerza HTTPS por 2 años
   * ⚠️ No habilitar en desarrollo (puede causar problemas con localhost)
   */
  if (process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = 'max-age=63072000'; // 2 años
  }

  // Aplicar todos los headers de seguridad a la respuesta
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Configuración del Matcher
 * Define las rutas donde se ejecutará este middleware
 * 
 * Rutas incluidas:
 * - /admin/*      - Panel de administración (requiere rol ADMIN)
 * - /profile/*    - Perfil de usuario (requiere autenticación)
 * 
 * Rutas excluidas automáticamente por Next.js:
 * - /api/auth/*   - Rutas de NextAuth
 * - /_next/*      - Archivos estáticos de Next.js
 * - /favicon.ico  - Favicon
 * - /public/*     - Archivos públicos
 */
export const config = {
  matcher: [
    "/admin/:path*",    // Todas las rutas bajo /admin
    "/profile/:path*",  // Todas las rutas bajo /profile
  ],
};
