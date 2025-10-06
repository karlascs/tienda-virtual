import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import { FilterProvider } from "@/context/FilterContext";

/**
 * Metadata de la aplicación
 * Define el título y descripción que aparecen en el navegador y motores de búsqueda
 */
export const metadata = { 
  title: "IZA & CAS - Tienda Online", 
  description: "IZA & CAS - Tu tienda de confianza para el hogar y decoración",
  icons: {
    icon: '/favicon.ico',      // Favicon personalizado de IZA & CAS
    shortcut: '/favicon.ico',  // Atajo del navegador
    apple: '/logo_isa&cas.png',        // Dispositivos iOS (PNG es mejor para Apple)
  },
};

/**
 * Layout Principal de la Aplicación - Fase 6 Mejorado
 * 
 * Este componente envuelve todas las páginas de la aplicación.
 * Configura la estructura HTML base y todos los providers de contexto.
 * 
 * Providers incluidos:
 * - CartProvider: Manejo del carrito de compras
 * - WishlistProvider: Sistema de lista de deseos persistente
 * - SearchProvider: Búsqueda en tiempo real
 * - FilterProvider: Filtros avanzados por categoría y precio
 * 
 * @param children - Componentes hijos que se renderizarán dentro del layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#4A6B6B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <SearchProvider>
          <FilterProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </CartProvider>
          </FilterProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
