'use client';

import { useCompare } from '@/context/CompareContext';
import styles from '@/styles/CompareFloating.module.css';

export default function CompareFloating() {
  const { state, openCompareModal, removeFromCompare } = useCompare();

  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className={styles.compareFloating}>
      <div className={styles.compareHeader}>
        <span className={styles.compareTitle}>
          ⚖️ Comparar ({state.items.length}/{state.maxItems})
        </span>
        {state.items.length >= 2 && (
          <button
            className={styles.compareBtn}
            onClick={openCompareModal}
          >
            Ver Comparación
          </button>
        )}
      </div>
      
      <div className={styles.compareItems}>
        {state.items.map((product) => (
          <div key={product.id} className={styles.compareItem}>
            <button
              className={styles.removeBtn}
              onClick={() => removeFromCompare(product.id)}
              aria-label={`Remover ${product.name} de comparación`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className={styles.productImage}>
              <img src={product.image} alt={product.name} />
            </div>
            
            <div className={styles.productInfo}>
              <h4 className={styles.productName}>{product.name}</h4>
              <p className={styles.productPrice}>
                {product.price.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Slots vacíos */}
        {Array.from({ length: state.maxItems - state.items.length }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.emptySlot}>
            <div className={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className={styles.emptyText}>Agregar producto</span>
          </div>
        ))}
      </div>
      
      {state.items.length < 2 && (
        <div className={styles.compareHint}>
          <span>Agrega al menos 2 productos para comparar</span>
        </div>
      )}
    </div>
  );
}