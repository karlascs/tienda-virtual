import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rutas que requieren autenticación de ADMIN
  const isAdminRoute = path.startsWith("/admin");
  
  // Rutas que requieren autenticación (cualquier usuario)
  const isProtectedRoute = path.startsWith("/profile") || path.startsWith("/orders");

  // Crear respuesta
  let response: NextResponse;

  if (isAdminRoute || isProtectedRoute) {
    const session = await auth();

    // No hay sesión activa
    if (!session?.user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", path);
      response = NextResponse.redirect(url);
    } else if (isAdminRoute && session.user.role !== "ADMIN") {
      // Verificar si es ruta de admin y el usuario no es admin
      response = NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador." },
        { status: 403 }
      );
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  // 🔒 ENCABEZADOS DE SEGURIDAD HTTP
  const securityHeaders: Record<string, string> = {
    // Prevenir ataques de clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevenir MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Protección XSS (legacy, pero aún útil para navegadores antiguos)
    'X-XSS-Protection': '1; mode=block',
    
    // Control de referrer
    'Referrer-Policy': 'origin-when-cross-origin',
    
    // Política de permisos
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    
    // DNS prefetch
    'X-DNS-Prefetch-Control': 'on',
  };

  // HSTS solo en producción
  if (process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  }

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requiere unsafe-eval
    "style-src 'self' 'unsafe-inline'", // CSS Modules requiere unsafe-inline
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  securityHeaders['Content-Security-Policy'] = cspHeader;

  // Aplicar todos los encabezados
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
};
