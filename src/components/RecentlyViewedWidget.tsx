"use client";

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useBrowsingHistory } from '@/context/BrowsingHistoryContext';
import styles from '@/styles/RecentlyViewedWidget.module.css';

interface RecentlyViewedWidgetProps {
  limit?: number;
  title?: string;
  showClearButton?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function RecentlyViewedWidget({
  limit = 6,
  title = "👁️ Vistos recientemente",
  showClearButton = true,
  orientation = 'horizontal',
  className = ''
}: RecentlyViewedWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    recentlyViewed, 
    clearHistory, 
    getViewedProductsCount,
    getCurrentSession 
  } = useBrowsingHistory();

  const displayedProducts = isExpanded 
    ? recentlyViewed 
    : recentlyViewed.slice(0, limit);

  const session = getCurrentSession();
  const totalViewed = getViewedProductsCount();

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar tu historial de navegación?')) {
      clearHistory();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (recentlyViewed.length === 0) {
    return (
      <div className={`${styles.recentlyViewedWidget} ${styles.empty} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>Aún no has visto ningún producto</h3>
          <p className={styles.emptyText}>
            Explora nuestra tienda y los productos que veas aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.recentlyViewedWidget} ${styles[orientation]} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.stats}>
            <span className={styles.count}>
              {recentlyViewed.length} producto{recentlyViewed.length !== 1 ? 's' : ''}
            </span>
            {session && (
              <span className={styles.sessionInfo}>
                • {session.viewedCount} vistas en esta sesión
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.controls}>
          {recentlyViewed.length > limit && (
            <button
              className={styles.expandButton}
              onClick={toggleExpanded}
              title={isExpanded ? 'Ver menos' : 'Ver todo'}
            >
              {isExpanded ? '🔼 Menos' : '🔽 Más'}
            </button>
          )}
          
          {showClearButton && (
            <button
              className={styles.clearButton}
              onClick={handleClearHistory}
              title="Limpiar historial"
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Grid de productos */}
      <div className={styles.productsContainer}>
        <div className={styles.productsGrid}>
          {displayedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className={styles.productWrapper}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                onClick={() => {
                  console.log(`Navegando a producto visto ${product.id}`);
                }}
              />
              <div className={styles.viewedIndicator}>
                <span className={styles.recentBadge}>Reciente</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicador de más productos */}
        {!isExpanded && recentlyViewed.length > limit && (
          <div className={styles.moreIndicator}>
            <div className={styles.moreText}>
              +{recentlyViewed.length - limit} productos más
            </div>
            <button 
              className={styles.viewAllButton}
              onClick={toggleExpanded}
            >
              Ver todos →
            </button>
          </div>
        )}
      </div>

      {/* Footer con información de sesión */}
      {session && (
        <div className={styles.footer}>
          <div className={styles.sessionDetails}>
            <span className={styles.sessionTime}>
              ⏱️ Navegando desde hace {Math.max(1, Math.round((new Date().getTime() - session.startTime.getTime()) / (1000 * 60)))} min
            </span>
            <span className={styles.totalViewed}>
              👀 {totalViewed} productos vistos en total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}