"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getAllProducts } from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';
import { useReviews } from '@/context/ReviewsContext';

// Interfaces para el sistema de recomendaciones
interface UserBehavior {
  viewedProducts: number[];
  categoryPreferences: Record<string, number>; // categoría -> peso
  priceRange: { min: number; max: number };
  lastActivity: Date;
}

interface RecommendationScore {
  productId: number;
  score: number;
  reasons: string[];
}

interface RecommendationsContextType {
  getRecommendations: (currentProductId?: number, limit?: number) => Product[];
  getPersonalizedRecommendations: (limit?: number) => Product[];
  getCategoryRecommendations: (category: string, limit?: number) => Product[];
  getSimilarProducts: (productId: number, limit?: number) => Product[];
  getPopularProducts: (limit?: number) => Product[];
  trackProductView: (productId: number, category: string, price: number) => void;
  getUserBehavior: () => UserBehavior;
  clearBehaviorData: () => void;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    viewedProducts: [],
    categoryPreferences: {},
    priceRange: { min: 0, max: Infinity },
    lastActivity: new Date()
  });

  const { wishlist } = useWishlist();
  const { productRatings } = useReviews();

  // Cargar comportamiento del usuario desde localStorage
  useEffect(() => {
    const savedBehavior = localStorage.getItem('iza-cas-user-behavior');
    if (savedBehavior) {
      const parsedBehavior = JSON.parse(savedBehavior);
      parsedBehavior.lastActivity = new Date(parsedBehavior.lastActivity);
      setUserBehavior(parsedBehavior);
    }
  }, []);

  // Guardar comportamiento en localStorage
  useEffect(() => {
    localStorage.setItem('iza-cas-user-behavior', JSON.stringify(userBehavior));
  }, [userBehavior]);

  // Registrar visualización de producto
  const trackProductView = (productId: number, category: string, price: number) => {
    setUserBehavior(prev => {
      const newBehavior = { ...prev };
      
      // Agregar producto a vistos (máximo 50 productos)
      if (!newBehavior.viewedProducts.includes(productId)) {
        newBehavior.viewedProducts = [productId, ...newBehavior.viewedProducts.slice(0, 49)];
      } else {
        // Mover al inicio si ya estaba visto
        newBehavior.viewedProducts = [
          productId,
          ...newBehavior.viewedProducts.filter(id => id !== productId)
        ];
      }
      
      // Actualizar preferencias de categoría
      newBehavior.categoryPreferences = {
        ...newBehavior.categoryPreferences,
        [category]: (newBehavior.categoryPreferences[category] || 0) + 1
      };
      
      // Actualizar rango de precio
      if (price < newBehavior.priceRange.min || newBehavior.priceRange.min === 0) {
        newBehavior.priceRange.min = price;
      }
      if (price > newBehavior.priceRange.max || newBehavior.priceRange.max === Infinity) {
        newBehavior.priceRange.max = price;
      }
      
      newBehavior.lastActivity = new Date();
      
      return newBehavior;
    });
  };

  // Calcular score de recomendación para un producto
  const calculateRecommendationScore = (product: Product, currentProductId?: number): RecommendationScore => {
    let score = 0;
    const reasons: string[] = [];

    // No recomendar el producto actual
    if (currentProductId && product.id === currentProductId) {
      return { productId: product.id, score: -1, reasons: [] };
    }

    // No recomendar productos ya vistos recientemente (últimos 5)
    if (userBehavior.viewedProducts.slice(0, 5).includes(product.id)) {
      score -= 0.3;
      reasons.push('Visto recientemente');
    }

    // Bonus por categoría preferida
    const categoryWeight = userBehavior.categoryPreferences[product.category] || 0;
    if (categoryWeight > 0) {
      score += Math.min(categoryWeight * 0.2, 1.0);
      reasons.push(`Te gusta la categoría ${product.category}`);
    }

    // Bonus por rango de precio
    const userMinPrice = userBehavior.priceRange.min || 0;
    const userMaxPrice = userBehavior.priceRange.max || Infinity;
    const priceDiff = Math.abs(product.price - (userMinPrice + userMaxPrice) / 2);
    const maxDiff = userMaxPrice - userMinPrice;
    
    if (maxDiff > 0 && product.price >= userMinPrice && product.price <= userMaxPrice) {
      const priceScore = 1 - (priceDiff / maxDiff);
      score += priceScore * 0.3;
      reasons.push('Precio en tu rango preferido');
    }

    // Bonus por estar en wishlist de otros usuarios (simulado)
    if (Math.random() > 0.7) {
      score += 0.2;
      reasons.push('Popular entre otros usuarios');
    }

    // Bonus por calificación alta
    const rating = productRatings.find(r => r.productId === product.id);
    if (rating && rating.averageRating >= 4) {
      score += rating.averageRating * 0.1;
      reasons.push(`Excelente calificación (${rating.averageRating.toFixed(1)}★)`);
    }

    // Bonus por cantidad de reseñas
    if (rating && rating.totalReviews >= 5) {
      score += Math.min(rating.totalReviews * 0.01, 0.2);
      reasons.push('Muchas reseñas positivas');
    }

    // Bonus aleatorio para diversidad
    score += Math.random() * 0.1;

    return { productId: product.id, score, reasons };
  };

  // Obtener recomendaciones generales
  const getRecommendations = (currentProductId?: number, limit: number = 8): Product[] => {
    const allProducts = getAllProducts();
    
    const scored = allProducts
      .map(product => ({
        product,
        ...calculateRecommendationScore(product, currentProductId)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(item => item.product);
  };

  // Recomendaciones personalizadas
  const getPersonalizedRecommendations = (limit: number = 6): Product[] => {
    // Si no hay historial, mostrar productos populares
    if (userBehavior.viewedProducts.length === 0) {
      return getPopularProducts(limit);
    }

    return getRecommendations(undefined, limit);
  };

  // Recomendaciones por categoría
  const getCategoryRecommendations = (category: string, limit: number = 6): Product[] => {
    const allProducts = getAllProducts();
    
    const categoryProducts = allProducts
      .filter(product => product.category === category)
      .map(product => ({
        product,
        ...calculateRecommendationScore(product)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return categoryProducts.map(item => item.product);
  };

  // Productos similares
  const getSimilarProducts = (productId: number, limit: number = 4): Product[] => {
    const allProducts = getAllProducts();
    const targetProduct = allProducts.find(p => p.id === productId);
    
    if (!targetProduct) return [];

    const similar = allProducts
      .filter(product => 
        product.id !== productId && 
        product.category === targetProduct.category
      )
      .map(product => {
        let score = 0;
        
        // Bonus por precio similar
        const priceDiff = Math.abs(product.price - targetProduct.price);
        const priceScore = Math.max(0, 1 - (priceDiff / targetProduct.price));
        score += priceScore * 0.5;
        
        // Bonus por calificación similar o mejor
        const targetRating = productRatings.find(r => r.productId === targetProduct.id);
        const productRating = productRatings.find(r => r.productId === product.id);
        
        if (targetRating && productRating) {
          const ratingDiff = Math.abs(productRating.averageRating - targetRating.averageRating);
          score += Math.max(0, 1 - ratingDiff) * 0.3;
        }
        
        // Bonus aleatorio
        score += Math.random() * 0.2;
        
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return similar.map(item => item.product);
  };

  // Productos populares (basado en ratings y reseñas)
  const getPopularProducts = (limit: number = 8): Product[] => {
    const allProducts = getAllProducts();
    
    const popular = allProducts
      .map(product => {
        const rating = productRatings.find(r => r.productId === product.id);
        let score = 0;
        
        if (rating) {
          score = rating.averageRating * rating.totalReviews * 0.1;
        }
        
        // Bonus aleatorio para diversidad
        score += Math.random() * 0.5;
        
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return popular.map(item => item.product);
  };

  // Obtener comportamiento del usuario
  const getUserBehavior = (): UserBehavior => userBehavior;

  // Limpiar datos de comportamiento
  const clearBehaviorData = () => {
    setUserBehavior({
      viewedProducts: [],
      categoryPreferences: {},
      priceRange: { min: 0, max: Infinity },
      lastActivity: new Date()
    });
    localStorage.removeItem('iza-cas-user-behavior');
  };

  return (
    <RecommendationsContext.Provider value={{
      getRecommendations,
      getPersonalizedRecommendations,
      getCategoryRecommendations,
      getSimilarProducts,
      getPopularProducts,
      trackProductView,
      getUserBehavior,
      clearBehaviorData
    }}>
      {children}
    </RecommendationsContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useRecommendations() {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations debe ser usado dentro de un RecommendationsProvider');
  }
  return context;
}