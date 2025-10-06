'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCarousel from '@/components/ProductCarousel';
import ProductModal from '@/components/ProductModal';
import WishlistButton from '@/components/WishlistButton';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleAddAllToCart = () => {
    wishlist.items.forEach(product => {
      addToCart(product);
    });
  };

  return (
    <>
      <Header />
      
      <main>
        <div className="container">
          {/* Título de la página */}
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
              ❤️ Lista de Deseos
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto 24px auto'
            }}>
              Tus productos favoritos guardados para más tarde
            </p>
            
            {wishlist.items.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  {wishlist.items.length} producto{wishlist.items.length !== 1 ? 's' : ''} en tu lista
                </span>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleAddAllToCart}
                    style={{
                      padding: '10px 16px',
                      background: 'var(--brand)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H2m5 7v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8m-8 4h.01M16 17h.01" />
                    </svg>
                    Agregar todo al carrito
                  </button>
                  
                  <button
                    onClick={clearWishlist}
                    style={{
                      padding: '10px 16px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Limpiar lista
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grid de productos de wishlist */}
          {wishlist.items.length > 0 ? (
            <div className="grid" style={{ marginBottom: '60px' }}>
              {wishlist.items.map((product) => (
                <div key={product.id} className="card" style={{ position: 'relative' }}>
                  {/* Botón de wishlist (para quitar) */}
                  <WishlistButton 
                    product={product} 
                    className="onCard" 
                  />
                  
                  {/* Badge de "En Favoritos" */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Favorito
                  </div>
                  
                  <ProductCarousel 
                    images={product.images} 
                    productName={product.name}
                    className="card-carousel"
                  />
                  
                  <div className="body" style={{ padding: '16px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {product.description}
                    </p>
                    <div className="price" style={{ 
                      fontSize: '20px',
                      fontWeight: '700',
                      color: 'var(--brand)'
                    }}>
                      ${product.price.toLocaleString('es-CL')}
                    </div>
                    <div className="productActions" style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <button 
                        className="addToCartBtn"
                        onClick={() => handleAddToCart(product)}
                        style={{
                          flex: '1',
                          background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H2m5 7v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8m-8 4h.01M16 17h.01" />
                        </svg>
                        Añadir al carrito
                      </button>
                      <button 
                        className="viewDetailsBtn"
                        onClick={() => handleViewDetails(product)}
                        style={{
                          background: 'transparent',
                          color: 'var(--brand)',
                          border: '2px solid var(--brand)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          minWidth: '120px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Estado vacío */
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ 
                fontSize: '72px', 
                marginBottom: '24px',
                filter: 'grayscale(1)',
                opacity: 0.6
              }}>
                💔
              </div>
              <h3 style={{ 
                marginBottom: '12px', 
                color: 'var(--text-primary)',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Tu lista de deseos está vacía
              </h3>
              <p style={{ 
                marginBottom: '32px',
                fontSize: '16px',
                maxWidth: '400px',
                margin: '0 auto 32px auto'
              }}>
                Explora nuestros productos y guarda tus favoritos para comprar más tarde
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center'
              }}>
                <Link 
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    background: 'var(--brand)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  Explorar productos
                </Link>
                
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <Link href="/products/hogar" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '14px' }}>🏠 Hogar</Link>
                  <Link href="/products/tecnologia" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '14px' }}>📱 Tecnología</Link>
                  <Link href="/products/juguetes" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '14px' }}>🧸 Juguetes</Link>
                  <Link href="/products/herramientas" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '14px' }}>🔧 Herramientas</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}

