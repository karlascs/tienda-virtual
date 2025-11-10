import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rutas que requieren autenticación de ADMIN
  const isAdminRoute = path.startsWith("/admin");
  
  // Rutas que requieren autenticación (cualquier usuario)
  const isProtectedRoute = path.startsWith("/profile") || path.startsWith("/orders");

  if (isAdminRoute || isProtectedRoute) {
    const session = await auth();

    // No hay sesión activa
    if (!session?.user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    // Verificar si es ruta de admin y el usuario no es admin
    if (isAdminRoute && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
};
