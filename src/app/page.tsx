import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import RecommendationsWidget from "@/components/RecommendationsWidget";
import Footer from "@/components/Footer";
import CompareModal from "@/components/CompareModal";
import CompareFloating from "@/components/CompareFloating";

/**
 * Página Principal de la Tienda Virtual - Fase 8 Completa
 * 
 * Esta es la página de inicio que muestra:
 * - Header con navegación
 * - Banner promocional IZA&CAS
 * - Categorías de productos con animaciones
 * - Grid de productos con aparición progresiva
 * - Widget de productos recientemente vistos
 * - Recomendaciones personalizadas y populares
 * - Footer completo con información de contacto y enlaces
 * 
 * Incluye sistema completo de navegación inteligente, recomendaciones y historial
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
      
      {/* Productos destacados que rotan semanalmente */}
      <FeaturedProducts />
      
      {/*Contenido principal de la página*/}
      <main>
        {/* Recomendaciones personalizadas */}
        <RecommendationsWidget 
          type="personalized"
          limit={6}
          showRefresh={true}
        />
        
        {/* Productos populares */}
        <RecommendationsWidget 
          type="popular"
          title="Los más populares"
          limit={4}
          showRefresh={false}
        />
      </main>
      
      {/* Footer completo con información de IZA&CAS */}
      <Footer />
      
      {/* Componentes de comparación */}
      <CompareFloating />
      <CompareModal />
    </>
  );
}
