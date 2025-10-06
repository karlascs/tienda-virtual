'use client';

import React, { useState, useEffect } from 'react';
import { useFilters } from '@/context/FilterContext';
import { Product } from '@/data/products';
import styles from '@/styles/FilterPanel.module.css';

interface FilterPanelProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ products, isOpen, onClose }: FilterPanelProps) {
  const {
    filters,
    setCategories,
    setPriceRange,
    setSortBy,
    resetFilters,
    getAvailableCategories,
    getPriceRange,
  } = useFilters();

  const [tempPriceRange, setTempPriceRange] = useState(filters.priceRange);
  const availableCategories = getAvailableCategories(products);
  const productPriceRange = getPriceRange(products);

  // Sincronizar precio temporal con filtros
  useEffect(() => {
    setTempPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setCategories(updatedCategories);
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = { ...tempPriceRange, [field]: numValue };
    setTempPriceRange(newRange);
  };

  const applyPriceRange = () => {
    setPriceRange(tempPriceRange);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceInput = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  const selectedCategoriesCount = filters.categories.length;
  const hasActiveFilters = selectedCategoriesCount > 0 || 
    filters.priceRange.min !== productPriceRange.min || 
    filters.priceRange.max !== productPriceRange.max ||
    filters.sortBy !== 'name';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />
      
      {/* Panel de filtros */}
      <div className={`${styles.filterPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.filterHeader}>
          <h2 className={styles.filterTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filtros
          </h2>
          
          <div className={styles.headerActions}>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className={styles.resetButton}
                type="button"
              >
                Limpiar
              </button>
            )}
            
            <button
              onClick={onClose}
              className={styles.closeButton}
              type="button"
              aria-label="Cerrar filtros"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.filterContent}>
          {/* Ordenar por */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Ordenar por</h3>
            <div className={styles.sortOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="sortBy"
                  value="name"
                  checked={filters.sortBy === 'name'}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Nombre (A-Z)
              </label>
              
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="sortBy"
                  value="price-asc"
                  checked={filters.sortBy === 'price-asc'}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Precio (Menor a Mayor)
              </label>
              
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="sortBy"
                  value="price-desc"
                  checked={filters.sortBy === 'price-desc'}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Precio (Mayor a Menor)
              </label>
              
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="sortBy"
                  value="category"
                  checked={filters.sortBy === 'category'}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Categoría
              </label>
            </div>
          </div>

          {/* Rango de precios */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Rango de Precio</h3>
            <div className={styles.priceRange}>
              <div className={styles.priceInputGroup}>
                <label className={styles.priceLabel}>Mínimo</label>
                <input
                  type="text"
                  value={formatPriceInput(tempPriceRange.min)}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value.replace(/\D/g, ''))}
                  onBlur={applyPriceRange}
                  className={styles.priceInput}
                  placeholder="0"
                />
              </div>
              
              <div className={styles.priceInputGroup}>
                <label className={styles.priceLabel}>Máximo</label>
                <input
                  type="text"
                  value={formatPriceInput(tempPriceRange.max)}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value.replace(/\D/g, ''))}
                  onBlur={applyPriceRange}
                  className={styles.priceInput}
                  placeholder="100000"
                />
              </div>
            </div>
            
            <div className={styles.priceInfo}>
              <span className={styles.priceRangeText}>
                Rango disponible: {formatPrice(productPriceRange.min)} - {formatPrice(productPriceRange.max)}
              </span>
            </div>
          </div>

          {/* Categorías */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>
              Categorías 
              {selectedCategoriesCount > 0 && (
                <span className={styles.selectedCount}>({selectedCategoriesCount})</span>
              )}
            </h3>
            
            <div className={styles.categoryList}>
              {availableCategories.map((category) => (
                <label key={category} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryCount}>
                    ({products.filter(p => p.category === category).length})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con resumen */}
        {hasActiveFilters && (
          <div className={styles.filterFooter}>
            <div className={styles.activeFiltersInfo}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Filtros activos aplicados</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
