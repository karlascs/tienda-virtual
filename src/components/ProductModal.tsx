'use client';

import React from 'react';
import { Product } from '@/context/CartContext';
import styles from '@/styles/ProductModal.module.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        <div className={styles.modalBody}>
          <div className={styles.imageSection}>
            <img 
              src={product.image} 
              alt={product.name}
              className={styles.productImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.svg';
              }}
            />
          </div>
          
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}