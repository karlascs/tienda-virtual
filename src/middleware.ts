import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rutas que requieren autenticación de ADMIN
  const isAdminRoute = path.startsWith("/admin");
  
  // Crear respuesta
  let response = NextResponse.next();

  // 🔒 ENCABEZADOS DE SEGURIDAD HTTP (solo lo esencial)
  const securityHeaders: Record<string, string> = {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
  };

  // HSTS solo en producción
  if (process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = 'max-age=63072000';
  }

  // Aplicar encabezados
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
  ],
};
