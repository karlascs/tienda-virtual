'use client';

import ProductCard from "./ProductCard";
import { useScrollAnimation, useScrollAnimationList } from "@/hooks/useScrollAnimation";
import { FEATURED_PRODUCTS } from "@/data/products";

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
 * - Mapeo eficiente de productos destacados
 * 
 * Futuras mejoras:
 * - Integración con API
 * - Paginación
 * - Filtros y búsqueda
 * - Loading states
 */
export default function ProductGrid() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(FEATURED_PRODUCTS.length, 0.2);

  return (
    <section className="container">
      {/* Título de la sección con animación */}
      <h2 
        ref={titleRef as React.RefObject<HTMLHeadingElement>}
        className={`fade-in-up ${titleVisible ? 'visible' : ''}`}
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
            />
          </div>
        ))}
      </div>
    </section>
  );
}
