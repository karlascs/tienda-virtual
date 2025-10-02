'use client';

import Link from 'next/link';
import styles from './Categories.module.css';
import { useScrollAnimation, useScrollAnimationList } from '@/hooks/useScrollAnimation';

/**
 * Datos de las categorías de productos
 * Sincronizadas con los enlaces de navegación del header
 */
const CATEGORIES = [
  {
    id: 'hogar',
    name: 'Hogar',
    title: 'Nuestro Hogar',
    subtitle: 'Productos esenciales para tu hogar',
    image: '/images/categorias/hogar.png',
    count: 6,
    href: '/products/hogar'
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    title: 'Herramientas',
    subtitle: 'Todo lo que necesitas para tus proyectos',
    image: '/images/categorias/herramientas.png',
    count: 8,
    href: '/products/herramientas'
  },
  {
    id: 'juguetes',
    name: 'Juguetes',
    title: 'Diversión y Aprendizaje',
    subtitle: 'Juguetes educativos para todas las edades',
    image: '/images/categorias/juguetes.png',
    count: 10,
    href: '/products/juguetes'
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    title: 'Tecnología ',
    subtitle: 'Los últimos avances tecnológicos',
    image: '/images/categorias/tecnologia.png',
    count: 8,
    href: '/products/tecnologia'
  },
  {
    id: 'cuidadopersonal',
    name: 'Cuidado Personal',
    title: 'Cuidado Personal',
    subtitle: 'Productos para tu bienestar y cuidado',
    image: '/images/categorias/cuidadopersonal.png',
    count: 5,
    href: '/products/cuidadopersonal'
  },
  {
    id: 'actividad',
    name: 'Actividad',
    title: 'Vida Activa',
    subtitle: 'Equipos para mantenerte en forma',
    image: '/images/categorias/actividad.png',
    count: 15,
    href: '/products/actividad'
  }
];

/**
 * Componente de Categorías
 * 
 * Muestra las diferentes categorías de productos como banners horizontales
 * con imágenes de fondo, diseño moderno y animaciones de scroll suaves
 * 
 * @returns Componente de categorías con navegación visual y animaciones
 */
export default function Categories() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { containerRef, visibleItems } = useScrollAnimationList(CATEGORIES.length, 0.2);

  return (
    <section className={styles.categories}>
      <div className="container">
        <h2 
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className={`${styles.title} fade-in-bounce ${titleVisible ? 'visible' : ''}`}
        >
          Categorías
        </h2>
        <div 
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={styles.grid}
        >
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              data-index={index}
              className={`fade-in-scale fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
            >
              <Link
                href={category.href}
                className={styles.banner}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                aria-label={`Ver ${category.name} (${category.count} productos)`}
              >
                <div className={styles.content}>
                  <h3 className={styles.title}>{category.title}</h3>
                  <p className={styles.subtitle}>{category.subtitle}</p>
                  <span className={styles.button}>VER MÁS</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}