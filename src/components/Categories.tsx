'use client';

import Link from 'next/link';
import styles from './Categories.module.css';
import { useScrollAnimation, useScrollAnimationList } from '@/hooks/useScrollAnimation';
import { useCategories } from '@/hooks/useProducts';

/**
 * Componente de Categorías
 * 
 * Muestra las diferentes categorías de productos como banners horizontales
 * con imágenes de fondo, diseño moderno y animaciones de scroll suaves
 * Ahora integrado con la API para obtener datos dinámicos
 * 
 * @returns Componente de categorías con navegación visual y animaciones
 */
export default function Categories() {
  const { categories, loading, error } = useCategories();
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(categories?.length || 0, 0.2);

  return (
    <section className={styles.categories}>
      <div className="container">
        <h2 
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className={`${styles.title} fade-in-bounce ${titleVisible ? 'visible' : ''}`}
        >
          Categorías
        </h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Cargando categorías...
            </p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--error)', fontSize: '18px' }}>
              Error al cargar categorías: {error}
            </p>
          </div>
        )}
        
        {!loading && !error && categories && categories.length > 0 && (
          <div 
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className={styles.grid}
          >
            {categories.map((category, index) => (
              <div
                key={category.id}
                data-index={index}
                className={`fade-in-scale fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className={styles.banner}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  aria-label={`Ver ${category.name}`}
                >
                  <div className={styles.content}>
                    <h3 className={styles.categoryTitle}>{category.name}</h3>
                    <p className={styles.categorySubtitle}>{category.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}