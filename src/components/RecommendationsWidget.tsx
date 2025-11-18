"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useRecommendations } from '@/context/RecommendationsContext';
import { Product } from '@/data/products';
import styles from '@/styles/RecommendationsWidget.module.css';

interface RecommendationsWidgetProps {
  type: 'personalized' | 'similar' | 'category' | 'popular';
  title?: string;
  productId?: number; // Para recomendaciones similares
  category?: string; // Para recomendaciones por categoría
  limit?: number;
  showRefresh?: boolean;
  className?: string;
  onProductClick?: (product: Product) => void;
}

export default function RecommendationsWidget({
  type,
  title,
  productId,
  category,
  limit = 6,
  showRefresh = true,
  className = '',
  onProductClick
}: RecommendationsWidgetProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    getPersonalizedRecommendations,
    getSimilarProducts,
    getCategoryRecommendations,
    getPopularProducts
  } = useRecommendations();

  // Obtener recomendaciones según el tipo
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let products: Product[] = [];

      switch (type) {
        case 'personalized':
          products = getPersonalizedRecommendations(limit);
          break;
        case 'similar':
          if (productId) {
            products = getSimilarProducts(productId, limit);
          }
          break;
        case 'category':
          if (category) {
            products = getCategoryRecommendations(category, limit);
          }
          break;
        case 'popular':
          products = getPopularProducts(limit);
          break;
      }

      setRecommendations(products);
      setIsLoading(false);
    };

    fetchRecommendations();
  }, [type, productId, category, limit, refreshKey]);

  // Refrescar recomendaciones
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Obtener título por defecto
  const getDefaultTitle = () => {
    switch (type) {
      case 'personalized':
        return 'Recomendado para ti';
      case 'similar':
        return 'Productos similares';
      case 'category':
        return `Más en ${category}`;
      case 'popular':
        return 'Productos populares';
      default:
        return 'Recomendaciones';
    }
  };

  const displayTitle = title || getDefaultTitle();

  if (isLoading) {
    return (
      <div className={`${styles.recommendationsWidget} ${className}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{displayTitle}</h3>
        </div>
        <div className={styles.loadingGrid}>
          {Array.from({ length: limit }, (_, index) => (
            <div key={index} className={styles.loadingSkeleton}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonPrice}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`${styles.recommendationsWidget} ${className}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{displayTitle}</h3>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤔</div>
          <p className={styles.emptyText}>
            No hay recomendaciones disponibles en este momento
          </p>
          {showRefresh && (
            <button 
              className={styles.refreshButton}
              onClick={handleRefresh}
            >
              🔄 Actualizar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.recommendationsWidget} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{displayTitle}</h3>
        {showRefresh && (
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            title="Actualizar recomendaciones"
          >
            🔄
          </button>
        )}
      </div>
      
      <div className={styles.recommendationsGrid}>
        {recommendations.map((product) => (
          <div key={product.id} className={styles.productWrapper}>
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              onClick={() => onProductClick?.(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}