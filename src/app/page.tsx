import Header from "@/components/Header";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";

/**
 * Página Principal de la Tienda Virtual
 * 
 * Esta es la página de inicio que muestra:
 * - Header con navegación
 * - Categorías de productos
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
      
      {/* Categorías de productos */}
      <Categories />
      
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
        © 2025 Casa Viva.cl — hecho  por karla cuevas
        {/* © 2025 Casa Viva.cl — Fase 1 (MVP estático) */}
      </footer>
    </>
  );
}
