"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces para el sistema de reviews
export interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number; // 1-5 estrellas
  comment: string;
  date: Date;
  helpful: number; // contador de "útil"
  verified: boolean; // compra verificada
}

export interface ProductRating {
  productId: number;
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsContextType {
  reviews: Review[];
  productRatings: ProductRating[];
  addReview: (productId: number, rating: number, comment: string, userName: string) => void;
  getProductReviews: (productId: number) => Review[];
  getProductRating: (productId: number) => ProductRating | null;
  markReviewHelpful: (reviewId: string) => void;
  getTotalReviewsCount: () => number;
  getAverageRating: (productId: number) => number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productRatings, setProductRatings] = useState<ProductRating[]>([]);

  // Cargar reviews desde localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('iza-cas-reviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews).map((review: any) => ({
        ...review,
        date: new Date(review.date)
      }));
      setReviews(parsedReviews);
    }
  }, []);

  // Guardar reviews en localStorage y recalcular ratings
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('iza-cas-reviews', JSON.stringify(reviews));
      calculateProductRatings();
    }
  }, [reviews]);

  // Calcular ratings por producto
  const calculateProductRatings = () => {
    const ratingsMap = new Map<number, ProductRating>();

    reviews.forEach(review => {
      const productId = review.productId;
      
      if (!ratingsMap.has(productId)) {
        ratingsMap.set(productId, {
          productId,
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }

      const rating = ratingsMap.get(productId)!;
      rating.totalReviews++;
      rating.distribution[review.rating as keyof typeof rating.distribution]++;
    });

    // Calcular promedio
    ratingsMap.forEach(rating => {
      const total = rating.distribution[5] * 5 + 
                   rating.distribution[4] * 4 + 
                   rating.distribution[3] * 3 + 
                   rating.distribution[2] * 2 + 
                   rating.distribution[1] * 1;
      rating.averageRating = total / rating.totalReviews;
    });

    setProductRatings(Array.from(ratingsMap.values()));
  };

  // Agregar nueva review
  const addReview = (productId: number, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      userName: userName || 'Usuario Anónimo',
      rating: Math.max(1, Math.min(5, rating)), // Validar rango 1-5
      comment: comment.trim(),
      date: new Date(),
      helpful: 0,
      verified: Math.random() > 0.3 // Simular compras verificadas
    };

    setReviews(prev => [newReview, ...prev]);

    // Mostrar notificación de éxito
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        alert('¡Gracias por tu reseña! Tu opinión ayuda a otros compradores.');
      }, 100);
    }
  };

  // Obtener reviews de un producto específico
  const getProductReviews = (productId: number): Review[] => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Más recientes primero
  };

  // Obtener rating de un producto
  const getProductRating = (productId: number): ProductRating | null => {
    return productRatings.find(rating => rating.productId === productId) || null;
  };

  // Marcar review como útil
  const markReviewHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  // Obtener total de reviews
  const getTotalReviewsCount = (): number => {
    return reviews.length;
  };

  // Obtener promedio de rating para un producto
  const getAverageRating = (productId: number): number => {
    const rating = getProductRating(productId);
    return rating ? rating.averageRating : 0;
  };

  return (
    <ReviewsContext.Provider value={{
      reviews,
      productRatings,
      addReview,
      getProductReviews,
      getProductRating,
      markReviewHelpful,
      getTotalReviewsCount,
      getAverageRating
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews debe ser usado dentro de un ReviewsProvider');
  }
  return context;
}