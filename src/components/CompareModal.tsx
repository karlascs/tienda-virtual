'use client';

import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import styles from '@/styles/CompareModal.module.css';

export default function CompareModal() {
  const { state, closeCompareModal, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!state.isCompareModalOpen || state.items.length < 2) {
    return null;
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Características comunes para comparar (simuladas - en una app real vendrían de la base de datos)
  const getProductFeatures = (product: Product) => ({
    'Categoría': product.category,
    'Precio': formatPrice(product.price),
    'Marca': 'IZA & CAS', // Simulado
    'Garantía': '1 año', // Simulado
    'Disponibilidad': 'En stock', // Simulado
    'Envío': 'Gratis', // Simulado
    'Rating': '⭐'.repeat(Math.floor(Math.random() * 2) + 4), // Simulado
    'Ventas': `${Math.floor(Math.random() * 100) + 50} vendidos`, // Simulado
  });

  const allFeatureKeys = [
    'Categoría', 'Precio', 'Marca', 'Garantía', 
    'Disponibilidad', 'Envío', 'Rating', 'Ventas'
  ];

  return (
    <div className={styles.modalOverlay} onClick={closeCompareModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.modalTitle}>
              ⚖️ Comparación de Productos
            </h2>
            <p className={styles.modalSubtitle}>
              Comparando {state.items.length} productos
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <button
              className={styles.clearAllBtn}
              onClick={clearCompare}
              title="Limpiar comparación"
            >
              🗑️ Limpiar todo
            </button>
            <button
              className={styles.closeBtn}
              onClick={closeCompareModal}
              aria-label="Cerrar modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido de la comparación */}
        <div className={styles.compareContent}>
          <div className={styles.compareTable}>
            {/* Encabezado con productos */}
            <div className={styles.tableHeader}>
              <div className={styles.featureColumn}>
                <span className={styles.featureLabel}>Características</span>
              </div>
              {state.items.map((product) => (
                <div key={product.id} className={styles.productColumn}>
                  <div className={styles.productCard}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCompare(product.id)}
                      aria-label={`Remover ${product.name} de comparación`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    
                    <div className={styles.productImage}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                    
                    <button
                      className={styles.addToCartBtn}
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="8" cy="21" r="1"/>
                        <circle cx="19" cy="21" r="1"/>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                      </svg>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Filas de características */}
            <div className={styles.tableBody}>
              {allFeatureKeys.map((featureKey, index) => (
                <div 
                  key={featureKey} 
                  className={`${styles.tableRow} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
                >
                  <div className={styles.featureColumn}>
                    <span className={styles.featureName}>{featureKey}</span>
                  </div>
                  {state.items.map((product) => {
                    const features = getProductFeatures(product);
                    const value = features[featureKey as keyof typeof features];
                    
                    return (
                      <div key={product.id} className={styles.featureValue}>
                        {featureKey === 'Precio' ? (
                          <span className={styles.priceHighlight}>{value}</span>
                        ) : (
                          <span>{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas de comparación */}
          <div className={styles.compareStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Productos comparados:</span>
              <span className={styles.statValue}>{state.items.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Categorías:</span>
              <span className={styles.statValue}>
                {[...new Set(state.items.map(item => item.category))].join(', ')}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Rango de precios:</span>
              <span className={styles.statValue}>
                {formatPrice(Math.min(...state.items.map(item => item.price)))} - {formatPrice(Math.max(...state.items.map(item => item.price)))}
              </span>
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className={styles.modalFooter}>
          <div className={styles.footerActions}>
            <button
              className={styles.addAllToCartBtn}
              onClick={() => {
                state.items.forEach(product => handleAddToCart(product));
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              Agregar todos al carrito
            </button>
            
            <button
              className={styles.closeModalBtn}
              onClick={closeCompareModal}
            >
              Cerrar comparación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}