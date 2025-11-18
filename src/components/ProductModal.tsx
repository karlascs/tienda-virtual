'use client';

import React, { useState } from 'react';
import { Product } from '@/data/products';
import { encodeImageUrl } from '@/utils/imageUtils';
import styles from '@/styles/ProductModal.module.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when product changes
  React.useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Usar images si existe, sino solo la imagen principal
  const images = product.images || [product.image];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        <div className={styles.modalBody}>
          {/* Sección de imágenes mejorada */}
          <div className={styles.imageSection}>
            {/* Imagen principal */}
            <div className={styles.mainImageContainer}>
              <img 
                src={encodeImageUrl(images[currentImageIndex] || product.image || '')}
                alt={`${product.name} - imagen ${currentImageIndex + 1}`}
                className={styles.mainImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.svg';
                }}
              />
              
              {/* Controles de navegación de imágenes */}
              {images.length > 1 && (
                <>
                  <button 
                    className={`${styles.imageNavButton} ${styles.prevButton}`}
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                  >
                    ❮
                  </button>
                  <button 
                    className={`${styles.imageNavButton} ${styles.nextButton}`}
                    onClick={handleNextImage}
                    aria-label="Imagen siguiente"
                  >
                    ❯
                  </button>
                  
                  {/* Indicador de imagen actual */}
                  <div className={styles.imageCounter}>
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnails de imágenes */}
            {images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${
                      index === currentImageIndex ? styles.activeThumbnail : ''
                    }`}
                    onClick={() => selectImage(index)}
                  >
                    <img 
                      src={encodeImageUrl(image || '')}
                      alt={`Vista ${index + 1}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sección de información del producto */}
          <div className={styles.infoSection}>
            <div className={styles.categoryTag}>
              {product.category}
            </div>
            
            <h2 className={styles.productTitle}>
              {product.name}
            </h2>
            
            <p className={styles.productDescription}>
              {product.description}
            </p>
            
            <div className={styles.priceSection}>
              <span className={styles.price}>
                ${product.price.toLocaleString('es-CL')}
              </span>
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                Añadir al carrito
              </button>
              
              <button 
                className={styles.continueShoppingBtn}
                onClick={onClose}
              >
                Seguir comprando
              </button>
            </div>
            
            <div className={styles.features}>
              <h3>Características:</h3>
              <ul>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Producto original
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  Envío a todo Chile
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  30 días de garantía
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Múltiples formas de pago
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Soporte técnico incluido
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Calidad garantizada
                </li>
              </ul>
            </div>
            
            {/* Nueva sección de información adicional */}
            <div className={styles.additionalInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <h4>Envío</h4>
                  <p>A todo Chile<br/>Entrega en 2-5 días hábiles</p>
                </div>
                <div className={styles.infoCard}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <h4>Devoluciones</h4>
                  <p>30 días para cambios<br/>Sin costo adicional</p>
                </div>
                <div className={styles.infoCard}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <h4>Pago</h4>
                  <p>Tarjetas, transferencia<br/>Pago contra entrega</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}