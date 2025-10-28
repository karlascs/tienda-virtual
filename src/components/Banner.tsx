'use client';

import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "@/styles/Banner.module.css";

/**
 * Componente Banner Carrusel IZA&CAS
 * 
 * Carrusel de banners promocionales que se alternan automáticamente
 * entre el header y las categorías de productos.
 * 
 * Características:
 * - Múltiples banners con transición automática
 * - Indicadores de navegación
 * - Imagen optimizada y responsive
 * - Animación de entrada suave con scroll
 * - Efectos hover elegantes
 * - Colores consistentes con la marca IZA&CAS
 */

interface BannerData {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface BannerProps {
  className?: string;
  style?: React.CSSProperties;
  autoSlide?: boolean;
  interval?: number;
}

// Configuración de banners - Agrega aquí tu banner navideño
const banners: BannerData[] = [
  {
    src: "/bannerIZAyCAS.png",
    alt: "IZA & CAS - Banner promocional de la tienda",
    title: "De Todo Para Tu Hogar",
    subtitle: "Descubre una amplia variedad de productos para el hogar a precios accesibles"
  },
  {
    src: "/llego la navidad.png", // Tu banner navideño
    alt: "IZA & CAS - ¡Llegó la Navidad! Ofertas Especiales",
    title: "¡Llegó la Navidad!",
    subtitle: "Encuentra los mejores regalos y decoraciones para esta temporada navideña"
  }
];

export default function Banner({ 
  className = "", 
  style = {}, 
  autoSlide = true, 
  interval = 5000 
}: BannerProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || banners.length <= 1) return;

    const timer = setInterval(() => {
      nextBanner();
    }, interval);

    return () => clearInterval(timer);
  }, [currentBanner, autoSlide, interval]);

  const nextBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToBanner = (index: number) => {
    if (isTransitioning || index === currentBanner) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBanner(index);
      setIsTransitioning(false);
    }, 300);
  };

  const current = banners[currentBanner];

  return (
    <section 
      ref={elementRef}
      className={`${styles.bannerSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={style}
    >
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <div className={`${styles.bannerSlide} ${isTransitioning ? styles.transitioning : ''}`}>
            <img
              src={current.src}
              alt={current.alt}
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
                target.alt = current.title || 'IZA & CAS - Tu tienda de confianza';
              }}
              onLoad={() => {
                console.log(`✅ Banner ${currentBanner + 1} cargado exitosamente`);
              }}
            />
          </div>

          {/* Controles de navegación - solo mostrar si hay más de un banner */}
          {banners.length > 1 && (
            <>
              <button 
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={prevBanner}
                disabled={isTransitioning}
                aria-label="Banner anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <button 
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={nextBanner}
                disabled={isTransitioning}
                aria-label="Siguiente banner"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Indicadores */}
              <div className={styles.indicators}>
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentBanner ? styles.active : ''}`}
                    onClick={() => goToBanner(index)}
                    disabled={isTransitioning}
                    aria-label={`Ir al banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}