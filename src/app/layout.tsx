import "./globals.css";
import { CartProvider } from "@/context/CartContext";

/**
 * Metadata de la aplicación
 * Define el título y descripción que aparecen en el navegador y motores de búsqueda
 */
export const metadata = { 
  title: "IZA & CAS - Tienda Online", 
  description: "IZA & CAS - Tu tienda de confianza para el hogar y decoración",
  icons: {
    icon: '/favicon.ico',      // Favicon personalizado de Casa Viva
    shortcut: '/favicon.ico',  // Atajo del navegador
    apple: '/logo_isa&cas.png',        // Dispositivos iOS (PNG es mejor para Apple)
  },
};

/**
 * Layout Principal de la Aplicación
 * 
 * Este componente envuelve todas las páginas de la aplicación.
 * Configura la estructura HTML base y aplica los estilos globales.
 * 
 * @param children - Componentes hijos que se renderizarán dentro del layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
