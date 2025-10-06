'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

// Tipos para filtros
interface PriceRange {
  min: number;
  max: number;
}

interface FilterState {
  categories: string[];
  priceRange: PriceRange;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'category';
  inStock: boolean;
}

interface FilterContextType {
  filters: FilterState;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: PriceRange) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setInStock: (inStock: boolean) => void;
  resetFilters: () => void;
  applyFilters: (products: Product[]) => Product[];
  getAvailableCategories: (products: Product[]) => string[];
  getPriceRange: (products: Product[]) => PriceRange;
}

// Estado inicial de filtros
const initialFilters: FilterState = {
  categories: [],
  priceRange: { min: 0, max: 100000 },
  sortBy: 'name',
  inStock: true,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider del contexto de filtros
interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setCategories = (categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const setPriceRange = (priceRange: PriceRange) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const setInStock = (inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Función para aplicar todos los filtros
  const applyFilters = (products: Product[]): Product[] => {
    let filteredProducts = [...products];

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filtrar por rango de precios
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Ordenar productos
    switch (filters.sortBy) {
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'category':
        filteredProducts.sort((a, b) => a.category.localeCompare(b.category, 'es'));
        break;
    }

    return filteredProducts;
  };

  // Función para obtener categorías únicas
  const getAvailableCategories = (products: Product[]): string[] => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.sort((a, b) => a.localeCompare(b, 'es'));
  };

  // Función para obtener el rango de precios
  const getPriceRange = (products: Product[]): PriceRange => {
    if (products.length === 0) return { min: 0, max: 100000 };
    
    const prices = products.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCategories,
        setPriceRange,
        setSortBy,
        setInStock,
        resetFilters,
        applyFilters,
        getAvailableCategories,
        getPriceRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Hook personalizado para usar el contexto de filtros
export function useFilters(): FilterContextType {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}