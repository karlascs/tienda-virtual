'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

// Tipos para el contexto de búsqueda
interface SearchContextType {
  searchTerm: string;
  searchResults: Product[];
  isSearching: boolean;
  setSearchTerm: (term: string) => void;
  searchProducts: (products: Product[], term: string) => Product[];
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider del contexto de búsqueda
interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Función de búsqueda avanzada
  const searchProducts = (products: Product[], term: string): Product[] => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }

    setIsSearching(true);
    const searchTermLower = term.toLowerCase();
    
    const results = products.filter(product => {
      // Búsqueda en nombre
      const nameMatch = product.name.toLowerCase().includes(searchTermLower);
      
      // Búsqueda en descripción
      const descriptionMatch = product.description.toLowerCase().includes(searchTermLower);
      
      // Búsqueda en categoría
      const categoryMatch = product.category.toLowerCase().includes(searchTermLower);
      
      // Búsqueda por precio (si el término es un número)
      const priceMatch = !isNaN(Number(searchTermLower)) && 
        product.price.toString().includes(searchTermLower);
      
      return nameMatch || descriptionMatch || categoryMatch || priceMatch;
    });

    // Ordenar resultados por relevancia
    const sortedResults = results.sort((a, b) => {
      // Priorizar coincidencias exactas en el nombre
      const aNameMatch = a.name.toLowerCase().includes(searchTermLower);
      const bNameMatch = b.name.toLowerCase().includes(searchTermLower);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // Luego por categoría
      const aCategoryMatch = a.category.toLowerCase().includes(searchTermLower);
      const bCategoryMatch = b.category.toLowerCase().includes(searchTermLower);
      
      if (aCategoryMatch && !bCategoryMatch) return -1;
      if (!aCategoryMatch && bCategoryMatch) return 1;
      
      // Finalmente por precio (menor a mayor)
      return a.price - b.price;
    });

    setSearchResults(sortedResults);
    setIsSearching(false);
    return sortedResults;
  };

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        searchResults,
        isSearching,
        setSearchTerm: handleSetSearchTerm,
        searchProducts,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

// Hook personalizado para usar el contexto de búsqueda
export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}