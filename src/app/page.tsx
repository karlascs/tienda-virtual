import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";

/**
 * Página Principal de la Tienda Virtual
 * 
 * Esta es la página de inicio que muestra:
 * - Header con navegación
 * - Grid de productos
 * - Footer con información del proyecto
 * 
 * Fase 1: MVP Estático - Sin funcionalidad interactiva
 */
export default function Home() {
  return (
    <>
      {/* Header fijo con navegación */}
      <Header />
      
      {/* Contenido principal de la página */}
      <main>
        <ProductGrid />
      </main>
      
      {/* Footer con información del proyecto */}
      <footer 
        className="container" 
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 MiTienda.cl — Fase 1 (MVP estático)
      </footer>
    </>
  );
}
