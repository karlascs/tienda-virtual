import Header from "@/components/Header";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import AnimatedFooter from "@/components/AnimatedFooter";

/**
 * Página Principal de la Tienda Virtual
 * 
 * Esta es la página de inicio que muestra:
 * - Header con navegación
 * - Categorías de productos con animaciones
 * - Grid de productos con aparición progresiva
 * - Footer con información del proyecto
 * 
 * Incluye animaciones de scroll suaves y armoniosạs
 */
export default function Home() {
  return (
    <>
      {/* Header fijo con navegación */}
      <Header />
      
      {/* Categorías de productos con animación */}
      <Categories />
      
      {/* Contenido principal de la página */}
      <main>
        <ProductGrid />
      </main>
      
      {/* Footer con información del proyecto */}
      <AnimatedFooter 
        animation="fade-in-up" 
        threshold={0.8}
        className="container"
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 IZA & CAS — hecho por karla cuevas
      </AnimatedFooter>
    </>
  );
}
