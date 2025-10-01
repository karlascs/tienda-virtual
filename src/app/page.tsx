import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

/**
 * Página Principal de la Tienda Virtual
 * 
 * Esta es la página de inicio que muestra:
 * - Header con navegación
 * - Banner promocional IZA&CAS
 * - Categorías de productos con animaciones
 * - Grid de productos con aparición progresiva
 * - Footer completo con información de contacto y enlaces
 * 
 * Incluye animaciones de scroll suaves y armoniosas
 */
export default function Home() {
  return (
    <>
      {/* Header fijo con navegación */}
      <Header />
      
      {/* Banner promocional IZA&CAS */}
      <Banner style={{ marginBottom: '40px' }} />
      
      {/* Categorías de productos con animación */}
      <Categories />
      
      {/* Contenido principal de la página */}
      <main>
        <ProductGrid />
      </main>
      
      {/* Footer completo con información de IZA&CAS */}
      <Footer />
    </>
  );
}
