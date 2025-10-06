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
}

export default function SearchBar({ 
  products, 
  onProductSelect, 
  placeholder = "Buscar productos...",
  showResults = true 
}: SearchBarProps) {
  const { searchTerm, searchResults, isSearching, setSearchTerm, searchProducts, clearSearch } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Manejar búsqueda en tiempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts(products, searchTerm);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300); // Debounce de 300ms

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
    // No limpiar el término de búsqueda para mantener el contexto
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
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

      {/* Dropdown de resultados */}
      {showResults && showDropdown && searchTerm.trim() && (
        <div className={styles.searchDropdown}>
          {searchResults.length > 0 ? (
            <>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className={styles.searchResults}>
                {searchResults.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className={styles.searchResultItem}
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
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productCategory}>{product.category}</p>
                      <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
                
                {searchResults.length > 8 && (
                  <div className={styles.moreResults}>
                    <span>Y {searchResults.length - 8} producto{searchResults.length - 8 !== 1 ? 's' : ''} más...</span>
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
                No se encontraron productos para "{searchTerm}"
              </p>
              <p className={styles.noResultsSubtext}>
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}