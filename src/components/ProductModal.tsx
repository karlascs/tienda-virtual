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
                🛒 Añadir al carrito
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
                <li>✅ Producto original</li>
                <li>🚚 Envío gratis</li>
                <li>🔄 30 días de garantía</li>
                <li>💳 Múltiples formas de pago</li>
                <li>📞 Soporte técnico incluido</li>
                <li>⭐ Calidad garantizada</li>
              </ul>
            </div>
            
            {/* Nueva sección de información adicional */}
            <div className={styles.additionalInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h4>🚚 Envío</h4>
                  <p>Gratis a todo Chile<br/>Entrega en 2-5 días hábiles</p>
                </div>
                <div className={styles.infoCard}>
                  <h4>🔄 Devoluciones</h4>
                  <p>30 días para cambios<br/>Sin costo adicional</p>
                </div>
                <div className={styles.infoCard}>
                  <h4>💳 Pago</h4>
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