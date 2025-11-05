"use client";

import React from 'react';
import styles from '@/styles/StarRating.module.css';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
  totalReviews?: number;
}

export default function StarRating({ 
  rating, 
  size = 'medium', 
  interactive = false, 
  onRatingChange,
  showText = false,
  totalReviews = 0
}: StarRatingProps) {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  return (
    <div className={`${styles.starRating} ${getSizeClass()}`}>
      <div className={styles.stars}>
        {/* Estrellas llenas */}
        {Array.from({ length: fullStars }, (_, index) => (
          <button
            key={`full-${index}`}
            className={`${styles.star} ${styles.full} ${interactive ? styles.interactive : ''}`}
            onClick={() => handleStarClick(index)}
            disabled={!interactive}
            aria-label={`${index + 1} estrellas`}
          >
            ★
          </button>
        ))}
        
        {/* Media estrella */}
        {hasHalfStar && (
          <button
            className={`${styles.star} ${styles.half} ${interactive ? styles.interactive : ''}`}
            onClick={() => handleStarClick(fullStars)}
            disabled={!interactive}
            aria-label={`${fullStars + 1} estrellas`}
          >
            <span className={styles.halfStar}>★</span>
          </button>
        )}
        
        {/* Estrellas vacías */}
        {Array.from({ length: emptyStars }, (_, index) => (
          <button
            key={`empty-${index}`}
            className={`${styles.star} ${styles.empty} ${interactive ? styles.interactive : ''}`}
            onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + index)}
            disabled={!interactive}
            aria-label={`${fullStars + (hasHalfStar ? 1 : 0) + index + 1} estrellas`}
          >
            ☆
          </button>
        ))}
      </div>
      
      {showText && (
        <div className={styles.ratingText}>
          <span className={styles.ratingValue}>
            {rating.toFixed(1)}
          </span>
          {totalReviews > 0 && (
            <span className={styles.reviewCount}>
              ({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  );
}