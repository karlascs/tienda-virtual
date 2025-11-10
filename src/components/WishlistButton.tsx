'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/data/products';
import styles from '@/styles/WishlistButton.module.css';

interface WishlistButtonProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({ 
  product, 
  size = 'medium', 
  showText = false,
  className = '' 
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const numericId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
  const inWishlist = isInWishlist(numericId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(numericId);
    } else {
      addToWishlist(product);
    }
  };

  const buttonClass = `${styles.wishlistButton} ${styles[size]} ${inWishlist ? styles.active : ''} ${className}`;

  return (
    <button
      onClick={handleClick}
      className={buttonClass}
      type="button"
      aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <div className={styles.iconWrapper}>
        {inWishlist ? (
          // Corazón relleno
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.heartIcon}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          // Corazón outline
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.heartIcon}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </div>
      
      {showText && (
        <span className={styles.buttonText}>
          {inWishlist ? 'En Favoritos' : 'Favoritos'}
        </span>
      )}
    </button>
  );
}