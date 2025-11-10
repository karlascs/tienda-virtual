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
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '24px'
              }}>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              
                <button
                  onClick={() => setShowFilters(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'var(--brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔍 Filtros
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
