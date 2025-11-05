'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

// Tipos de datos
interface CompareState {
  items: Product[];
  maxItems: number;
  isCompareModalOpen: boolean;
}

type CompareAction =
  | { type: 'ADD_TO_COMPARE'; payload: Product }
  | { type: 'REMOVE_FROM_COMPARE'; payload: number }
  | { type: 'TOGGLE_COMPARE'; payload: Product }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'OPEN_COMPARE_MODAL' }
  | { type: 'CLOSE_COMPARE_MODAL' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Product[] };

// Estado inicial
const initialState: CompareState = {
  items: [],
  maxItems: 4, // Máximo 4 productos para comparar
  isCompareModalOpen: false,
};

// Clave para LocalStorage
const COMPARE_STORAGE_KEY = 'iza-cas-compare';

// Funciones de utilidad para LocalStorage
const loadCompareFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading compare from localStorage:', error);
    return [];
  }
};

const saveCompareToStorage = (items: Product[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving compare to localStorage:', error);
  }
};

// Reducer para manejar las acciones del comparador
function compareReducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case 'ADD_TO_COMPARE': {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists || state.items.length >= state.maxItems) return state;
      
      const newItems = [...state.items, action.payload];
      saveCompareToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
      };
    }
    
    case 'REMOVE_FROM_COMPARE': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      saveCompareToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
      };
    }
    
    case 'TOGGLE_COMPARE': {
      const exists = state.items.find(item => item.id === action.payload.id);
      
      if (exists) {
        // Remover si ya existe
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        saveCompareToStorage(newItems);
        
        return {
          ...state,
          items: newItems,
        };
      } else {
        // Agregar si no existe y hay espacio
        if (state.items.length >= state.maxItems) return state;
        
        const newItems = [...state.items, action.payload];
        saveCompareToStorage(newItems);
        
        return {
          ...state,
          items: newItems,
        };
      }
    }
    
    case 'CLEAR_COMPARE': {
      saveCompareToStorage([]);
      return {
        ...state,
        items: [],
      };
    }
    
    case 'OPEN_COMPARE_MODAL': {
      return {
        ...state,
        isCompareModalOpen: true,
      };
    }
    
    case 'CLOSE_COMPARE_MODAL': {
      return {
        ...state,
        isCompareModalOpen: false,
      };
    }
    
    case 'LOAD_FROM_STORAGE': {
      return {
        ...state,
        items: action.payload.slice(0, state.maxItems), // Respetar el límite
      };
    }
    
    default:
      return state;
  }
}

// Contexto
interface CompareContextType {
  state: CompareState;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (id: number) => void;
  toggleCompare: (product: Product) => boolean;
  clearCompare: () => void;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isInCompare: (id: number) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

// Provider
interface CompareProviderProps {
  children: ReactNode;
}

export function CompareProvider({ children }: CompareProviderProps) {
  const [state, dispatch] = useReducer(compareReducer, initialState);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedItems = loadCompareFromStorage();
    if (savedItems.length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedItems });
    }
  }, []);

  const addToCompare = (product: Product): boolean => {
    if (state.items.length >= state.maxItems) {
      showNotification(`⚠️ Máximo ${state.maxItems} productos para comparar`, 'warning');
      return false;
    }
    
    if (state.items.find(item => item.id === product.id)) {
      showNotification(`ℹ️ ${product.name} ya está en comparación`, 'info');
      return false;
    }
    
    dispatch({ type: 'ADD_TO_COMPARE', payload: product });
    showNotification(`⚖️ ${product.name} añadido a comparación`, 'success');
    return true;
  };

  const removeFromCompare = (id: number) => {
    const product = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_FROM_COMPARE', payload: id });
    if (product) {
      showNotification(`🗑️ ${product.name} removido de comparación`, 'info');
    }
  };

  const toggleCompare = (product: Product): boolean => {
    const isCurrentlyInCompare = state.items.some(item => item.id === product.id);
    
    if (isCurrentlyInCompare) {
      dispatch({ type: 'TOGGLE_COMPARE', payload: product });
      showNotification(`🗑️ ${product.name} removido de comparación`, 'info');
      return false;
    } else {
      if (state.items.length >= state.maxItems) {
        showNotification(`⚠️ Máximo ${state.maxItems} productos para comparar`, 'warning');
        return false;
      }
      
      dispatch({ type: 'TOGGLE_COMPARE', payload: product });
      showNotification(`⚖️ ${product.name} añadido a comparación`, 'success');
      return true;
    }
  };

  const clearCompare = () => {
    dispatch({ type: 'CLEAR_COMPARE' });
    showNotification('🗑️ Lista de comparación limpiada', 'info');
  };

  const openCompareModal = () => {
    if (state.items.length < 2) {
      showNotification('⚠️ Agrega al menos 2 productos para comparar', 'warning');
      return;
    }
    dispatch({ type: 'OPEN_COMPARE_MODAL' });
  };

  const closeCompareModal = () => {
    dispatch({ type: 'CLOSE_COMPARE_MODAL' });
  };

  const isInCompare = (id: number): boolean => {
    return state.items.some(item => item.id === id);
  };

  const canAddMore = state.items.length < state.maxItems;

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    if (typeof window === 'undefined') return;

    const notification = document.createElement('div');
    let bgColor = 'linear-gradient(135deg, #d4a574 0%, #2c4a43 100%)';
    
    switch (type) {
      case 'warning':
        bgColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        break;
      case 'info':
        bgColor = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        break;
    }
    
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
    <CompareContext.Provider value={{
      state,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      openCompareModal,
      closeCompareModal,
      isInCompare,
      canAddMore,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

// Hook personalizado
export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare debe ser usado dentro de un CompareProvider');
  }
  return context;
}

// Hook para obtener estadísticas del comparador
export function useCompareStats() {
  const { state } = useCompare();
  
  return {
    totalItems: state.items.length,
    maxItems: state.maxItems,
    isEmpty: state.items.length === 0,
    isFull: state.items.length >= state.maxItems,
    canCompare: state.items.length >= 2,
    availableSlots: state.maxItems - state.items.length,
    categories: [...new Set(state.items.map(item => item.category))],
    priceRange: state.items.length > 0 ? {
      min: Math.min(...state.items.map(item => item.price)),
      max: Math.max(...state.items.map(item => item.price)),
    } : null,
  };
}