'use client';

import { useState } from 'react';
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useScrollAnimation, useScrollAnimationList } from "@/hooks/useScrollAnimation";
import { useCart } from "@/context/CartContext";
import { useFeaturedProducts, Product } from "@/hooks/useProducts";

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
  const { products: featuredProducts, loading, error } = useFeaturedProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(featuredProducts.length, 0.2);

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
          
          {/* Estados de carga y error */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                Cargando productos...
              </p>
            </div>
          )}
          
          {error && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--error)', fontSize: '18px' }}>
                Error al cargar productos: {error}
              </p>
            </div>
          )}
          
          {/* Grid responsivo de productos con animaciones */}
          {!loading && !error && (
            <div 
              ref={containerRef as React.RefObject<HTMLDivElement>}
              className="grid"
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  data-index={index}
                  className={`fade-in-up fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
                >
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image!}
                    images={product.images}
                    category={product.category}
                    onClick={() => handleViewDetails(product)}
                  />
                </div>
              ))}
            </div>
          )}
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
