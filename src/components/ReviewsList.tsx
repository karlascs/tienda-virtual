"use client";

import React, { useState } from 'react';
import StarRating from './StarRating';
import { useReviews, Review } from '@/context/ReviewsContext';
import styles from '@/styles/ReviewsList.module.css';

interface ReviewsListProps {
  productId: number;
  showForm?: boolean;
}

export default function ReviewsList({ productId, showForm = true }: ReviewsListProps) {
  const { getProductReviews, getProductRating, markReviewHelpful } = useReviews();
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  const reviews = getProductReviews(productId);
  const productRating = getProductRating(productId);

  // Filtrar y ordenar reseñas
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'recent':
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId);
  };

  if (reviews.length === 0) {
    return (
      <div className={styles.reviewsContainer}>
        <div className={styles.noReviews}>
          <div className={styles.noReviewsIcon}>💭</div>
          <h3>Aún no hay reseñas</h3>
          <p>Sé el primero en compartir tu opinión sobre este producto</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      {/* Resumen de calificaciones */}
      {productRating && (
        <div className={styles.ratingSummary}>
          <div className={styles.overallRating}>
            <div className={styles.ratingScore}>
              {productRating.averageRating.toFixed(1)}
            </div>
            <div className={styles.ratingDetails}>
              <StarRating 
                rating={productRating.averageRating} 
                size="medium" 
                showText={false}
              />
              <div className={styles.totalReviews}>
                Basado en {productRating.totalReviews} reseña{productRating.totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          {/* Distribución de calificaciones */}
          <div className={styles.ratingDistribution}>
            {[5, 4, 3, 2, 1].map(stars => {
              const count = productRating.distribution[stars as keyof typeof productRating.distribution];
              const percentage = productRating.totalReviews > 0 
                ? (count / productRating.totalReviews) * 100 
                : 0;
              
              return (
                <div key={stars} className={styles.distributionRow}>
                  <button
                    className={`${styles.distributionButton} ${filterRating === stars ? styles.active : ''}`}
                    onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                  >
                    <span className={styles.starLabel}>{stars}★</span>
                    <div className={styles.distributionBar}>
                      <div 
                        className={styles.distributionFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={styles.distributionCount}>({count})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de filtro y ordenamiento */}
      <div className={styles.reviewsControls}>
        <div className={styles.controlsGroup}>
          <label htmlFor="sortBy" className={styles.controlLabel}>
            Ordenar por:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating' | 'helpful')}
            className={styles.sortSelect}
          >
            <option value="recent">Más recientes</option>
            <option value="rating">Mejor calificación</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
        
        {filterRating && (
          <button
            onClick={() => setFilterRating(null)}
            className={styles.clearFilter}
          >
            Mostrar todas las reseñas ✕
          </button>
        )}
      </div>

      {/* Lista de reseñas */}
      <div className={styles.reviewsList}>
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewAuthor}>
                <div className={styles.authorAvatar}>
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>
                    {review.userName}
                    {review.verified && (
                      <span className={styles.verifiedBadge} title="Compra verificada">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <div className={styles.reviewDate}>
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>
              
              <StarRating 
                rating={review.rating} 
                size="small" 
              />
            </div>
            
            <div className={styles.reviewContent}>
              <p className={styles.reviewComment}>
                {review.comment}
              </p>
            </div>
            
            <div className={styles.reviewFooter}>
              <button
                onClick={() => handleMarkHelpful(review.id)}
                className={styles.helpfulButton}
                title="Marcar como útil"
              >
                👍 Útil ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}