'use client';

import ProductCard from "./ProductCard";
import { useScrollAnimation, useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Datos de productos mock para la demo
 * En futuras fases, estos datos vendrán de una API o base de datos
 */
const MOCK = [
  { name: "Hervidor Eléctrico 1.7L", price: 29990, image: "/images/hogar/hervidor-electrico.webp" },
  { name: "Batidora", price: 59990, image: "/images/hogar/batidora-inmersion.avif" },
  { name: "Batidora Inmersión", price: 25990, image: "/images/hogar/batidora-inmersion.avif" },
  { name: "Horno Eléctrico", price: 42990, image: "/images/hogar/horno-electrico.jpg" },
];

/**
 * Componente ProductGrid
 * 
 * Grid responsivo que muestra todos los productos disponibles con animaciones de scroll.
 * 
 * Características:
 * - Layout CSS Grid responsivo
 * - Auto-ajuste de columnas (mínimo 220px)
 * - Animaciones de aparición progresiva
 * - Datos mock integrados
 * - HTML semántico con <section>
 * - Mapeo eficiente de productos
 * 
 * Futuras mejoras:
 * - Integración con API
 * - Paginación
 * - Filtros y búsqueda
 * - Loading states
 */
export default function ProductGrid() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(MOCK.length, 0.2);

  return (
    <section className="container">
      {/* Título de la sección con animación */}
      <h2 
        ref={titleRef as React.RefObject<HTMLHeadingElement>}
        className={`fade-in-up ${titleVisible ? 'visible' : ''}`}
      >
        Productos
      </h2>
      
      {/* Grid responsivo de productos con animaciones */}
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="grid"
      >
        {MOCK.map((product, index) => (
          <div
            key={index}
            data-index={index}
            className={`fade-in-up fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
          >
            <ProductCard 
              {...product} // Spread de todas las propiedades del producto
            />
          </div>
        ))}
      </div>
    </section>
  );
}
