'use client';

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "@/styles/Banner.module.css";

/**
 * Componente Banner Principal IZA&CAS
 * 
 * Banner promocional que se muestra en la página principal
 * entre el header y las categorías de productos.
 * 
 * Características:
 * - Imagen optimizada y responsive
 * - Animación de entrada suave con scroll
 * - Efectos hover elegantes
 * - Colores consistentes con la marca IZA&CAS
 */

interface BannerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Banner({ className = "", style = {} }: BannerProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section 
      ref={elementRef}
      className={`${styles.bannerSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={style}
    >
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <img
            src="/bannerIZAyCAS.png"
            alt="IZA & CAS - Banner promocional de la tienda"
            className={styles.bannerImage}
            loading="eager"
            onError={(e) => {
              console.error('Error cargando banner:', e);
              const target = e.target as HTMLImageElement;
              target.style.background = 'linear-gradient(135deg, #2d4a4a 0%, #d4a574 100%)';
              target.style.color = 'white';
              target.style.height = '200px';
              target.style.display = 'flex';
              target.style.alignItems = 'center';
              target.style.justifyContent = 'center';
              target.alt = 'IZA & CAS - Tu tienda de confianza';
            }}
            onLoad={() => {
              console.log('✅ Banner IZA&CAS cargado exitosamente');
            }}
          />
        </div>
      </div>
    </section>
  );
}