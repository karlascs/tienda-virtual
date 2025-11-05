"use client";

import React, { useState } from 'react';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import { useReviews } from '@/context/ReviewsContext';
import styles from '@/styles/ReviewsModal.module.css';

interface ReviewsModalProps {
  productId: number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewsModal({ productId, productName, isOpen, onClose }: ReviewsModalProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const { getProductRating } = useReviews();
  
  const productRating = getProductRating(productId);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'reviews' | 'write') => {
    setActiveTab(tab);
  };

  const handleReviewSubmitted = () => {
    setActiveTab('reviews'); // Cambiar a la pestaña de reseñas después de enviar
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Reseñas de "{productName}"
          </h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Estadísticas rápidas */}
        {productRating && (
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{productRating.averageRating.toFixed(1)}</span>
              <span className={styles.statLabel}>Promedio</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{productRating.totalReviews}</span>
              <span className={styles.statLabel}>Reseñas</span>
            </div>
          </div>
        )}

        {/* Pestañas */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('reviews')}
          >
            📝 Ver Reseñas
            {productRating && productRating.totalReviews > 0 && (
              <span className={styles.tabBadge}>{productRating.totalReviews}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'write' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('write')}
          >
            ✍️ Escribir Reseña
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className={styles.tabContent}>
          {activeTab === 'reviews' && (
            <ReviewsList productId={productId} showForm={false} />
          )}
          
          {activeTab === 'write' && (
            <ReviewForm 
              productId={productId} 
              productName={productName}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}
        </div>
      </div>
    </div>
  );
}