'use client';

import { useState, useRef } from 'react';
import { useCarouselKeyboard } from '@/hooks/useCarouselKeyboard';
import styles from '@/styles/ProductCarousel.module.css';

interface ProductCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export default function ProductCarousel({ images, productName, className = '' }: ProductCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Hook para navegación con teclado
  useCarouselKeyboard({
    isActive: isHovered,
    onNext: nextImage,
    onPrev: prevImage,
    totalImages: images.length
  });

  // Manejo de gestos táctiles
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Si solo hay una imagen, mostrar sin controles
  if (images.length <= 1) {
    return (
      <div className={`${styles.singleImageContainer} ${className}`}>
        <img 
          src={images[0]} 
          alt={productName}
          className={styles.singleImage}
        />
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      className={`${styles.carouselContainer} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
    >
      {/* Imagen principal */}
      <div className={styles.imageWrapper}>
        <img 
          src={images[currentImageIndex]} 
          alt={`${productName} - imagen ${currentImageIndex + 1}`}
          className={styles.carouselImage}
        />
        
        {/* Botones de navegación */}
        <button 
          onClick={prevImage}
          className={`${styles.navButton} ${styles.prevButton} ${
            isHovered ? styles.visible : ''
          }`}
          aria-label="Imagen anterior"
          title="Imagen anterior (← o flecha izquierda)"
        >
          ‹
        </button>
        <button 
          onClick={nextImage}
          className={`${styles.navButton} ${styles.nextButton} ${
            isHovered ? styles.visible : ''
          }`}
          aria-label="Siguiente imagen"
          title="Siguiente imagen (→ o espacio)"
        >
          ›
        </button>

        {/* Contador de imágenes */}
        <div className={styles.imageCounter}>
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Barra de progreso */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progress}
            style={{ 
              width: `${((currentImageIndex + 1) / images.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Indicadores de puntos */}
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`${styles.indicator} ${
              index === currentImageIndex ? styles.active : ''
            }`}
            aria-label={`Ver imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Miniaturas (para productos con más de 2 imágenes) */}
      {images.length > 2 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`${styles.thumbnail} ${
                index === currentImageIndex ? styles.activeThumbnail : ''
              }`}
              title={`Imagen ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`${productName} miniatura ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}