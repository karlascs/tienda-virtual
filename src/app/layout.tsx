import "./globals.css";

/**
 * Metadata de la aplicación
 * Define el título y descripción que aparecen en el navegador y motores de búsqueda
 */
export const metadata = { title: "Mi Tienda", description: "Vitrina e-commerce" };

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
      <body>{children}
      </body>
    </html>
  );
}
