'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { HOGAR_PRODUCTS, Product } from "@/data/products";

export default function HogarPage() {
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
              🏠 Productos para el Hogar
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Todo lo que necesitas para hacer tu hogar más cómodo y funcional
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {HOGAR_PRODUCTS.map((product) => (
              <div key={product.id} className="card">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                    background: '#f8fafc',
                    padding: '12px'
                  }}
                />
                <div className="card body" style={{ padding: '16px' }}>
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
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(45, 74, 74, 0.2)'
                      }}
                    >
                      🛒 Añadir al carrito
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
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Modal para ver detalles del producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
      
      <footer 
        className="container" 
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 IZA & CAS — hecho por karla cuevas
      </footer>
    </>
  );
}