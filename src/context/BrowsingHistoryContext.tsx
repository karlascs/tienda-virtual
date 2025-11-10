"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getProductById } from '@/data/products';

// Interfaces para el historial de navegación
interface ViewedProduct {
  id: number;
  timestamp: Date;
  sessionId: string;
  category: string;
  price: number;
}

interface BrowsingSession {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  viewedCount: number;
}

interface BrowsingHistoryContextType {
  recentlyViewed: Product[];
  addToHistory: (productId: number) => void;
  getRecentlyViewed: (limit?: number) => Product[];
  clearHistory: () => void;
  getViewedProductsCount: () => number;
  getLastViewedCategory: () => string | null;
  getCurrentSession: () => BrowsingSession | null;
  getTotalViewTime: () => number; // en minutos
}

const BrowsingHistoryContext = createContext<BrowsingHistoryContextType | undefined>(undefined);

// Generar ID de sesión único
const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function BrowsingHistoryProvider({ children }: { children: ReactNode }) {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);
  const [currentSession, setCurrentSession] = useState<BrowsingSession | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Inicializar sesión y cargar historial
  useEffect(() => {
    // Crear nueva sesión
    const newSession: BrowsingSession = {
      sessionId: generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      viewedCount: 0
    };
    setCurrentSession(newSession);

    // Cargar historial desde localStorage
    const savedHistory = localStorage.getItem('iza-cas-browsing-history');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      
      // Filtrar productos de los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentHistory = parsedHistory.filter(
        (item: ViewedProduct) => item.timestamp > thirtyDaysAgo
      );
      
      setViewedProducts(recentHistory);
    }
  }, []);

  // Actualizar productos recientemente vistos cuando cambia el historial
  useEffect(() => {
    const updateRecentlyViewed = () => {
      // Obtener IDs únicos de productos vistos (máximo 20)
      const uniqueIds = Array.from(
        new Set(
          viewedProducts
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map(item => item.id)
        )
      ).slice(0, 20);

      // Obtener productos desde la base de datos
      const products = uniqueIds
        .map(id => getProductById(id))
        .filter(product => product !== undefined) as Product[];

      setRecentlyViewed(products);
    };

    updateRecentlyViewed();
  }, [viewedProducts]);

  // Guardar historial en localStorage
  useEffect(() => {
    if (viewedProducts.length > 0) {
      localStorage.setItem('iza-cas-browsing-history', JSON.stringify(viewedProducts));
    }
  }, [viewedProducts]);

  // Agregar producto al historial
  const addToHistory = (productId: number) => {
    const product = getProductById(productId);
    if (!product || !currentSession) return;

    const now = new Date();
    
    // Verificar si el producto ya fue visto en los últimos 5 minutos
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const recentView = viewedProducts.find(
      item => item.id === productId && item.timestamp > fiveMinutesAgo
    );

    if (recentView) {
      // Actualizar timestamp del producto existente
      setViewedProducts(prev => 
        prev.map(item => 
          item.id === productId && item.timestamp === recentView.timestamp
            ? { ...item, timestamp: now }
            : item
        )
      );
    } else {
      // Agregar nueva visualización
      const newView: ViewedProduct = {
        id: productId,
        timestamp: now,
        sessionId: currentSession.sessionId,
        category: product.category || '',
        price: product.price
      };

      setViewedProducts(prev => [newView, ...prev.slice(0, 99)]); // Máximo 100 productos
    }

    // Actualizar sesión actual
    setCurrentSession(prev => prev ? {
      ...prev,
      lastActivity: now,
      viewedCount: prev.viewedCount + 1
    } : null);
  };

  // Obtener productos recientemente vistos
  const getRecentlyViewed = (limit: number = 10): Product[] => {
    return recentlyViewed.slice(0, limit);
  };

  // Limpiar historial
  const clearHistory = () => {
    setViewedProducts([]);
    setRecentlyViewed([]);
    localStorage.removeItem('iza-cas-browsing-history');
    
    // Crear nueva sesión
    const newSession: BrowsingSession = {
      sessionId: generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      viewedCount: 0
    };
    setCurrentSession(newSession);
  };

  // Obtener cantidad de productos vistos
  const getViewedProductsCount = (): number => {
    return viewedProducts.length;
  };

  // Obtener última categoría vista
  const getLastViewedCategory = (): string | null => {
    if (viewedProducts.length === 0) return null;
    
    const latestView = viewedProducts.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
    
    return latestView.category;
  };

  // Obtener sesión actual
  const getCurrentSession = (): BrowsingSession | null => {
    return currentSession;
  };

  // Calcular tiempo total de visualización en minutos
  const getTotalViewTime = (): number => {
    if (!currentSession) return 0;
    
    const now = new Date();
    const sessionDuration = now.getTime() - currentSession.startTime.getTime();
    return Math.round(sessionDuration / (1000 * 60)); // Convertir a minutos
  };

  return (
    <BrowsingHistoryContext.Provider value={{
      recentlyViewed,
      addToHistory,
      getRecentlyViewed,
      clearHistory,
      getViewedProductsCount,
      getLastViewedCategory,
      getCurrentSession,
      getTotalViewTime
    }}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useBrowsingHistory() {
  const context = useContext(BrowsingHistoryContext);
  if (context === undefined) {
    throw new Error('useBrowsingHistory debe ser usado dentro de un BrowsingHistoryProvider');
  }
  return context;
}