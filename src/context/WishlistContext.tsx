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
    const savedWishlist = localStorage.getItem('iza-cas-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Guardar wishlist en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('iza-cas-wishlist', JSON.stringify(wishlist.items));
  }, [wishlist.items]);

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
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