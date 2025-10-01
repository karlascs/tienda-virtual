'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Productos de Tecnología - IZA & CAS
 * 
 * Categoría dedicada a tecnología y electrónicos
 * Incluye: computadoras, smartphones, tablets, accesorios
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de tecnología (estáticos para MVP)
const TECNOLOGIA_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Gaming MSI",
    price: 1299990,
    image: "/images/tecnologia/laptop-gaming.jpg",
    description: "Laptop gaming de alto rendimiento con procesador Intel i7 y RTX 4060"
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 999990,
    image: "/images/tecnologia/iphone-15-pro.jpg",
    description: "iPhone 15 Pro con chip A17 Pro y cámaras profesionales"
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 899990,
    image: "/images/tecnologia/macbook-air.jpg",
    description: "MacBook Air con chip M2, ultraligero y potente para trabajo profesional"
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    price: 799990,
    image: "/images/tecnologia/galaxy-s24.jpg",
    description: "Samsung Galaxy S24 con inteligencia artificial y cámaras avanzadas"
  },
  {
    id: 5,
    name: "iPad Pro 12.9",
    price: 749990,
    image: "/images/tecnologia/ipad-pro.jpg",
    description: "iPad Pro de 12.9 pulgadas con chip M2 y pantalla Liquid Retina XDR"
  },
  {
    id: 6,
    name: "AirPods Pro 2",
    price: 199990,
    image: "/images/tecnologia/airpods-pro.jpg",
    description: "AirPods Pro de segunda generación con cancelación activa de ruido"
  }
];

export default function TecnologiaPage() {
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
              💻 Tecnología & Electrónicos
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Los últimos avances en tecnología para tu vida digital
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {TECNOLOGIA_PRODUCTS.map((product) => (
              <div key={product.id} className="card">
                <img 
                  src={product.image} 
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
                      onClick={() => console.log('Añadir al carrito:', product.name)}
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
                      onClick={() => console.log('Ver detalles:', product.name)}
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