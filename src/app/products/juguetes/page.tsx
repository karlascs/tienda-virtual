'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import FilterPanel from '@/components/FilterPanel';
import { useCart } from '@/context/CartContext';
import { useFilters } from '@/context/FilterContext';
import { useProducts, Product } from '@/hooks/useProducts';
import styles from '@/styles/juguetes.module.css';

/**
 * Productos de Juguetes - IZA & CAS
 * 
 * Categoría dedicada a juguetes y entretenimiento infantil
 * Incluye: juguetes educativos, electrónicos, creativos
 * Con animaciones suaves y experiencia de usuario moderna
 * Ahora integrado con la API para obtener datos dinámicos
 */

export default function JuguetesPage() {
  const { addToCart } = useCart();
  const { applyFilters } = useFilters();
  const { products: juguetesProducts, loading, error } = useProducts('juguetes');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtros a los productos
  const filteredProducts = applyFilters(juguetesProducts);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      <Header />
      
      <main>
        <div className="container">
          {/* Título de la categoría */}
          <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              color: 'var(--text-primary)', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
                Juguetes & Diversión
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Juguetes educativos y de entretenimiento para todas las edades
            </p>
            
            {/* Estados de carga y error */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                  Cargando productos...
                </p>
              </div>
            )}
            
            {error && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--error)', fontSize: '18px' }}>
                  Error al cargar productos: {error}
                </p>
              </div>
            )}
            
            {/* Controles de filtros */}
            {!loading && !error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '1200px',
                margin: '24px auto 0',
                padding: '0 20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <span style={{
                  color: '#666',
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  {filteredProducts.length === juguetesProducts.length ? (
                    `${juguetesProducts.length} producto${juguetesProducts.length !== 1 ? 's' : ''}`
                  ) : (
                    <>
                      {juguetesProducts.length} producto{juguetesProducts.length !== 1 ? 's' : ''} disponible{juguetesProducts.length !== 1 ? 's' : ''}
                      <span style={{ color: '#1a1a1a', marginLeft: '8px' }}>
                        ({filteredProducts.length} mostrado{filteredProducts.length !== 1 ? 's' : ''})
                      </span>
                    </>
                  )}
                </span>
              
                <button
                  onClick={() => setShowFilters(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#6b6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#5a5a5a'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#6b6b6b'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filtrar
                </button>
              </div>
            )}
          </div>

          {/* Grid de productos */}
          {!loading && !error && (
            <div className={styles.productsGrid} style={{ marginBottom: '60px' }}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard} style={{ position: 'relative' }}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    images={product.images}
                    category="juguetes"
                    onClick={() => handleViewDetails(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Panel de filtros */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        products={juguetesProducts}
      />
      
      {/* Modal para ver detalles del producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
