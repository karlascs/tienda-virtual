'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "@/styles/Banner.module.css";

/**
 * Componente Banner Carrusel IZA&CAS - Dinámico desde Base de Datos
 * 
 * Carrusel de banners promocionales que se cargan desde la API
 * y se alternan automáticamente entre el header y las categorías de productos.
 * 
 * Características:
 * - Banners dinámicos desde base de datos
 * - Los administradores pueden agregar/editar banners desde el panel admin
 * - Transición automática entre banners
 * - Indicadores de navegación
 * - Imagen optimizada y responsive
 * - Animación de entrada suave con scroll
 * - Enlaces opcionales en cada banner
 */

interface BannerData {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
}

interface BannerProps {
  className?: string;
  style?: React.CSSProperties;
  autoSlide?: boolean;
  interval?: number;
}

export default function Banner({ 
  className = "", 
  style = {}, 
  autoSlide = true, 
  interval = 5000 
}: BannerProps) {
  const { elementRef, isVisible } = useScrollAnimation();
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cargar banners desde la API
  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setBanners(data.data);
        } else {
          // Fallback: banner por defecto si no hay banners en la BD
          setBanners([{
            id: 'default',
            title: 'De Todo Para Tu Hogar',
            subtitle: 'Descubre una amplia variedad de productos a precios accesibles',
            imageUrl: '/bannerIZAyCAS.png',
            link: null,
            order: 0
          }]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading banners:', error);
        // Fallback: banner por defecto en caso de error
        setBanners([{
          id: 'default',
          title: 'De Todo Para Tu Hogar',
          subtitle: 'Descubre una amplia variedad de productos a precios accesibles',
          imageUrl: '/bannerIZAyCAS.png',
          link: null,
          order: 0
        }]);
        setLoading(false);
      });
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || banners.length <= 1 || loading) return;

    const timer = setInterval(() => {
      nextBanner();
    }, interval);

    return () => clearInterval(timer);
  }, [currentBanner, autoSlide, interval, banners.length, loading]);

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

  if (loading || banners.length === 0) {
    return (
      <section className={`${styles.bannerSection} ${className}`} style={style}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerLoading}>Cargando...</div>
        </div>
      </section>
    );
  }

  const current = banners[currentBanner];

  const BannerContent = () => (
    <div className={`${styles.bannerSlide} ${isTransitioning ? styles.transitioning : ''}`}>
      <img
        src={current.imageUrl}
        alt={current.title}
        className={styles.bannerImage}
        loading="eager"
        onError={(e) => {
          console.error('Error cargando banner:', current.imageUrl);
          const target = e.target as HTMLImageElement;
          target.style.background = 'linear-gradient(135deg, #ebddceff 0%, #d6b28cff 100%)';
          target.style.color = 'white';
          target.style.height = '200px';
          target.style.display = 'flex';
          target.style.alignItems = 'center';
          target.style.justifyContent = 'center';
          target.alt = current.title;
        }}
      />
    </div>
  );

  return (
    <section 
      ref={elementRef}
      className={`${styles.bannerSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={style}
    >
      {/* Efecto de partículas brillantes de fondo */}
      <div className={styles.sparklesBackground}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.sparkle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          {/* Si el banner tiene link, envolver en Link, sino solo mostrar la imagen */}
          {current.link ? (
            <Link href={current.link} className={styles.bannerLink}>
              <BannerContent />
            </Link>
          ) : (
            <BannerContent />
          )}

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