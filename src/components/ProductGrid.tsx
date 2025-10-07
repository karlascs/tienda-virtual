'use client';

import { useState } from 'react';
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useScrollAnimation, useScrollAnimationList } from "@/hooks/useScrollAnimation";
import { useCart } from "@/context/CartContext";
import { FEATURED_PRODUCTS, Product } from "@/data/products";

/**
 * Componente ProductGrid
 * 
 * Grid responsivo que muestra productos destacados de diferentes categorías en la página principal.
 * Los productos se obtienen de la base de datos centralizada y se actualizan automáticamente.
 * 
 * Características:
 * - Layout CSS Grid responsivo
 * - Auto-ajuste de columnas (mínimo 220px)
 * - Animaciones de aparición progresiva
 * - Productos sincronizados con la base de datos central
 * - HTML semántico con <section>
 * - Modal de detalles funcional
 * - Integración con carrito de compras
 * 
 * Futuras mejoras:
 * - Integración con API
 * - Paginación
 * - Filtros y búsqueda
 * - Loading states
 */
export default function ProductGrid() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(FEATURED_PRODUCTS.length, 0.2);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      <section className="products-section">
        <div className="container">
          {/* Título de la sección con animación */}
          <h2 
            ref={titleRef as React.RefObject<HTMLHeadingElement>}
            className={`fade-in-bounce ${titleVisible ? 'visible' : ''}`}
          >
            Productos Destacados
          </h2>
          
          {/* Grid responsivo de productos con animaciones */}
          <div 
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="grid"
          >
            {FEATURED_PRODUCTS.map((product, index) => (
              <div
                key={product.id}
                data-index={index}
                className={`fade-in-up fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
              >
                <ProductCard 
                  name={product.name}
                  price={product.price}
                  image={product.image!}
                  onClick={() => handleViewDetails(product)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Modal para ver detalles del producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
