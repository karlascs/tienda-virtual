"use client";

import React, { useState } from 'react';
import StarRating from './StarRating';
import ReviewsModal from './ReviewsModal';
import { useReviews } from '@/context/ReviewsContext';
import styles from '@/styles/ReviewsButton.module.css';

interface ReviewsButtonProps {
  productId: number;
  productName: string;
  variant?: 'default' | 'compact' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

export default function ReviewsButton({ 
  productId, 
  productName, 
  variant = 'default',
  showIcon = true,
  className = ''
}: ReviewsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getProductRating, getAverageRating } = useReviews();
  
  const productRating = getProductRating(productId);
  const averageRating = getAverageRating(productId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getButtonContent = () => {
    if (variant === 'minimal') {
      return (
        <div className={styles.minimalContent}>
          {averageRating > 0 ? (
            <>
              <StarRating rating={averageRating} size="small" />
              <span className={styles.reviewCount}>
                ({productRating?.totalReviews || 0})
              </span>
            </>
          ) : (
            <span className={styles.noReviewsText}>Sin reseñas</span>
          )}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div className={styles.compactContent}>
          {showIcon && <span className={styles.icon}>⭐</span>}
          {averageRating > 0 ? (
            <>
              <span className={styles.rating}>{averageRating.toFixed(1)}</span>
              <span className={styles.reviewText}>
                ({productRating?.totalReviews || 0} reseñas)
              </span>
            </>
          ) : (
            <span className={styles.reviewText}>Escribir primera reseña</span>
          )}
        </div>
      );
    }

    // Variant: default
    return (
      <div className={styles.defaultContent}>
        {showIcon && <span className={styles.icon}>📝</span>}
        <div className={styles.textContent}>
          {averageRating > 0 ? (
            <>
              <div className={styles.ratingRow}>
                <StarRating rating={averageRating} size="small" />
                <span className={styles.rating}>{averageRating.toFixed(1)}</span>
              </div>
              <span className={styles.reviewText}>
                {productRating?.totalReviews || 0} reseña{(productRating?.totalReviews || 0) !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <>
              <span className={styles.noRatingText}>¿Ya lo compraste?</span>
              <span className={styles.reviewText}>Escribe la primera reseña</span>
            </>
          )}
        </div>
      </div>
    );
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'compact': return styles.compact;
      case 'minimal': return styles.minimal;
      default: return styles.default;
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`${styles.reviewsButton} ${getVariantClass()} ${className}`}
        aria-label={`Ver reseñas de ${productName}`}
      >
        {getButtonContent()}
      </button>

      <ReviewsModal
        productId={productId}
        productName={productName}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}