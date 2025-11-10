'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/context/SearchContext';
import { Product } from '@/data/products';
import styles from '@/styles/SearchBar.module.css';

interface SearchBarProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  placeholder?: string;
  showResults?: boolean;
  showSuggestions?: boolean;
}

// Sugerencias de búsqueda populares
const POPULAR_SEARCHES = [
  'auriculares bluetooth',
  'sillas gamer',
  'ventiladores',
  'cafeteras',
  'aspiradoras',
  'juguetes educativos',
  'herramientas eléctricas',
  'almohadas memory foam'
];

// Categorías para sugerencias
const CATEGORY_SUGGESTIONS = [
  { name: 'Hogar', icon: '🏠', searches: ['muebles', 'decoración', 'cocina', 'limpieza'] },
  { name: 'Tecnología', icon: '📱', searches: ['celulares', 'notebooks', 'auriculares', 'cámaras'] },
  { name: 'Juguetes', icon: '🧸', searches: ['juegos', 'muñecas', 'carros', 'educativos'] },
  { name: 'Herramientas', icon: '🔧', searches: ['taladros', 'martillos', 'llaves', 'eléctricas'] },
  { name: 'Actividad', icon: '⚽', searches: ['deportes', 'camping', 'fitness', 'aire libre'] },
  { name: 'Cuidado Personal', icon: '💄', searches: ['belleza', 'cuidado', 'higiene', 'salud'] }
];

export default function SearchBar({ 
  products, 
  onProductSelect, 
  placeholder = "Buscar productos...",
  showResults = true,
  showSuggestions = true
}: SearchBarProps) {
  const { searchTerm, searchResults, isSearching, setSearchTerm, searchProducts, clearSearch } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generar sugerencias de autocompletado basadas en productos
  const generateAutocompleteSuggestions = (term: string): string[] => {
    if (!term.trim()) return [];
    
    const termLower = term.toLowerCase();
    const suggestions = new Set<string>();
    
    // Agregar nombres de productos que coincidan
    products.forEach(product => {
      const words = product.name.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.startsWith(termLower) && word !== termLower) {
          suggestions.add(word);
        }
      });
      
      // Agregar nombre completo si coincide parcialmente
      if (product.name.toLowerCase().includes(termLower) && 
          !product.name.toLowerCase().startsWith(termLower)) {
        suggestions.add(product.name);
      }
    });
    
    // Agregar búsquedas populares que coincidan
    POPULAR_SEARCHES.forEach(search => {
      if (search.toLowerCase().includes(termLower)) {
        suggestions.add(search);
      }
    });
    
    // Agregar términos de categorías
    CATEGORY_SUGGESTIONS.forEach(category => {
      category.searches.forEach(search => {
        if (search.toLowerCase().includes(termLower)) {
          suggestions.add(search);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 6);
  };

  // Manejar búsqueda en tiempo real con autocompletado
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(products, searchTerm);
        setAutocompleteSuggestions(generateAutocompleteSuggestions(searchTerm));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
        setAutocompleteSuggestions([]);
      }
      setSelectedIndex(-1);
    }, 200); // Debounce reducido para mejor UX

    return () => clearTimeout(timeoutId);
  }, [searchTerm, products, searchProducts]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setShowDropdown(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setShowDropdown(false);
    setFocused(false);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowDropdown(false);
    setAutocompleteSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = autocompleteSuggestions.length + Math.min(searchResults.length, 8);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < autocompleteSuggestions.length) {
            handleSuggestionClick(autocompleteSuggestions[selectedIndex]);
          } else {
            const productIndex = selectedIndex - autocompleteSuggestions.length;
            if (searchResults[productIndex]) {
              handleProductClick(searchResults[productIndex]);
            }
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocused(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORY_SUGGESTIONS.find(cat => 
      cat.name.toLowerCase() === category.toLowerCase()
    );
    return categoryData?.icon || '📦';
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={`${styles.searchInputWrapper} ${focused ? styles.focused : ''}`}>
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            setFocused(true);
            if (searchTerm.trim() && searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={styles.clearButton}
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        
        {isSearching && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {/* Dropdown de resultados mejorado */}
      {showResults && showDropdown && (
        <div className={styles.searchDropdown}>
          {/* Sugerencias de autocompletado */}
          {!searchTerm.trim() && showSuggestions && (
            <div className={styles.suggestionsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>🔥 Búsquedas populares</span>
              </div>
              <div className={styles.popularSearches}>
                {POPULAR_SEARCHES.slice(0, 4).map((search, index) => (
                  <button
                    key={search}
                    className={styles.popularSearchItem}
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    {search}
                  </button>
                ))}
              </div>
              
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>📂 Categorías</span>
              </div>
              <div className={styles.categorySuggestions}>
                {CATEGORY_SUGGESTIONS.slice(0, 3).map((category) => (
                  <div key={category.name} className={styles.categoryItem}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIcon}>{category.icon}</span>
                      <span className={styles.categoryName}>{category.name}</span>
                    </div>
                    <div className={styles.categorySearches}>
                      {category.searches.slice(0, 2).map((search) => (
                        <button
                          key={search}
                          className={styles.categorySearchItem}
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias de autocompletado cuando hay término de búsqueda */}
          {searchTerm.trim() && autocompleteSuggestions.length > 0 && (
            <div className={styles.autocompleteSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>💡 Sugerencias</span>
              </div>
              <div className={styles.autocompleteSuggestions}>
                {autocompleteSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className={`${styles.autocompleteItem} ${selectedIndex === index ? styles.selected : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span>
                      {suggestion.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                        <>
                          {suggestion.substring(0, suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()))}
                          <strong className={styles.highlightMatch}>
                            {suggestion.substring(
                              suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()),
                              suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length
                            )}
                          </strong>
                          {suggestion.substring(suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length)}
                        </>
                      ) : (
                        suggestion
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de productos */}
          {searchTerm.trim() && (
            <>
              {searchResults.length > 0 ? (
                <>
                  <div className={styles.resultsHeader}>
                    <span className={styles.resultsCount}>
                      🛍️ {searchResults.length} producto{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.searchResults}>
                    {searchResults.slice(0, 6).map((product, index) => {
                      const resultIndex = autocompleteSuggestions.length + index;
                      return (
                        <div
                          key={product.id}
                          className={`${styles.searchResultItem} ${selectedIndex === resultIndex ? styles.selected : ''}`}
                          onClick={() => handleProductClick(product)}
                        >
                          <div className={styles.productImage}>
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                            />
                          </div>
                          
                          <div className={styles.productInfo}>
                            <h4 className={styles.productName}>
                              {product.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                                <>
                                  {product.name.substring(0, product.name.toLowerCase().indexOf(searchTerm.toLowerCase()))}
                                  <strong className={styles.highlightMatch}>
                                    {product.name.substring(
                                      product.name.toLowerCase().indexOf(searchTerm.toLowerCase()),
                                      product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length
                                    )}
                                  </strong>
                                  {product.name.substring(product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length)}
                                </>
                              ) : (
                                product.name
                              )}
                            </h4>
                            <p className={styles.productCategory}>
                              <span className={styles.categoryIcon}>{getCategoryIcon(product.category || '')}</span>
                              {product.category}
                            </p>
                            <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                          </div>

                          <div className={styles.productActions}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                    
                    {searchResults.length > 6 && (
                      <div className={styles.moreResults}>
                        <span>📦 Y {searchResults.length - 6} producto{searchResults.length - 6 !== 1 ? 's' : ''} más...</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p className={styles.noResultsText}>
                    No se encontraron productos para &quot;{searchTerm}&quot;
                  </p>
                  <p className={styles.noResultsSubtext}>
                    Intenta con otros términos o explora nuestras categorías
                  </p>
                  
                  {/* Sugerencias alternativas cuando no hay resultados */}
                  <div className={styles.alternativeSuggestions}>
                    <span className={styles.suggestionLabel}>Prueba con:</span>
                    <div className={styles.alternativeItems}>
                      {POPULAR_SEARCHES.slice(0, 3).map((search) => (
                        <button
                          key={search}
                          className={styles.alternativeItem}
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
