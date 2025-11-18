'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import RecommendationsWidget from "@/components/RecommendationsWidget";
import Footer from "@/components/Footer";
import CompareModal from "@/components/CompareModal";
import CompareFloating from "@/components/CompareFloating";
import ChristmasEffects from "@/components/ChristmasEffects";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { Product } from '@/data/products';

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
 * - Efectos navideños especiales
 * 
 * Incluye sistema completo de navegación inteligente, recomendaciones y historial
 */
export default function Home() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      {/* Efectos navideños */}
      <ChristmasEffects />
      
      {/* Header fijo con navegación */}
      <Header />
      
      {/* Banner promocional IZA&CAS */}
      <Banner style={{ marginBottom: '40px' }} />
      
      {/* Categorías de productos con animación */}
      <Categories />
      
      {/* Productos destacados que rotan semanalmente */}
      <FeaturedProducts onProductClick={handleViewDetails} />
      
      {/*Contenido principal de la página*/}
      <main>
        {/* Recomendaciones personalizadas */}
        <RecommendationsWidget 
          type="personalized"
          limit={6}
          showRefresh={true}
          onProductClick={handleViewDetails}
        />
        
        {/* Productos populares */}
        <RecommendationsWidget 
          type="popular"
          title="Los más populares"
          limit={4}
          showRefresh={false}
          onProductClick={handleViewDetails}
        />
      </main>
      
      {/* Footer completo con información de IZA&CAS */}
      <Footer />
      
      {/* Componentes de comparación */}
      <CompareFloating />
      <CompareModal />

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
