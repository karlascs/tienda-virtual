'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';

// Tipos de datos para Wishlist
interface WishlistState {
  items: Product[];
  itemCount: number;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'TOGGLE_WISHLIST'; payload: Product }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

// Estado inicial
const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

// Reducer para manejar las acciones de la wishlist
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si ya existe, no agregarlo nuevamente
        return state;
      }
      
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.length,
      };
    }
    
    case 'TOGGLE_WISHLIST': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si existe, removerlo
        const filteredItems = state.items.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          items: filteredItems,
          itemCount: filteredItems.length,
        };
      } else {
        // Si no existe, agregarlo
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          itemCount: newItems.length,
        };
      }
    }
    
    case 'CLEAR_WISHLIST': {
      return {
        ...state,
        items: [],
        itemCount: 0,
      };
    }
    
    case 'LOAD_WISHLIST': {
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.length,
      };
    }
    
    default:
      return state;
  }
}

// Contexto de Wishlist
interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider del contexto
interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);

  // Cargar wishlist desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('iza-cas-wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, []);

  // Guardar wishlist en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iza-cas-wishlist', JSON.stringify(wishlist.items));
    }
  }, [wishlist.items]);

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    showNotification(`💖 ${product.name} añadido a favoritos`, 'success');
  };

  const removeFromWishlist = (productId: number) => {
    const product = wishlist.items.find(item => item.id === productId);
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    if (product) {
      showNotification(`💔 ${product.name} removido de favoritos`, 'info');
    }
  };

  const toggleWishlist = (product: Product) => {
    const isCurrentlyInWishlist = wishlist.items.some(item => item.id === product.id);
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    
    if (isCurrentlyInWishlist) {
      showNotification(`💔 ${product.name} removido de favoritos`, 'info');
    } else {
      showNotification(`💖 ${product.name} añadido a favoritos`, 'success');
    }
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    showNotification('🗑️ Lista de favoritos limpiada', 'info');
  };

  const isInWishlist = (productId: number) => {
    return wishlist.items.some(item => item.id === productId);
  };

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    if (typeof window === 'undefined') return;

    const notification = document.createElement('div');
    const bgColor = type === 'success' 
      ? 'linear-gradient(135deg, #d4a574 0%, #2c4a43 100%)'
      : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(45, 74, 74, 0.3);
      z-index: 10000;
      font-weight: 600;
      font-size: 14px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Hook para obtener estadísticas de la wishlist
export function useWishlistStats() {
  const { wishlist } = useWishlist();
  
  return {
    totalItems: wishlist.itemCount,
    isEmpty: wishlist.itemCount === 0,
    categories: [...new Set(wishlist.items.map(item => item.category))],
    totalValue: wishlist.items.reduce((total, item) => total + item.price, 0),
    recentlyAdded: wishlist.items.slice(-3), // Últimos 3 productos añadidos
  };
}