'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Productos de Juguetes - IZA & CAS
 * 
 * Categoría dedicada a juguetes y entretenimiento infantil
 * Incluye: juguetes educativos, electrónicos, creativos
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de juguetes (estáticos para MVP)
const JUGUETES_PRODUCTS = [
  {
    id: 1,
    name: "Lego Creator Expert",
    price: 79990,
    image: "/images/juguetes/lego-creator.jpg",
    description: "Set de construcción Lego Creator para mayores de 16 años"
  },
  {
    id: 2,
    name: "Tablet Educativa para Niños",
    price: 89990,
    image: "/images/juguetes/tablet-ninos.jpg",
    description: "Tablet resistente con contenido educativo y control parental"
  },
  {
    id: 3,
    name: "Dron con Cámara HD",
    price: 129990,
    image: "/images/juguetes/dron-camara.jpg",
    description: "Dron para principiantes con cámara HD y control remoto"
  },
  {
    id: 4,
    name: "Pista de Carreras Eléctrica",
    price: 64990,
    image: "/images/juguetes/pista-carreras.jpg",
    description: "Pista de autos eléctricos con controles inalámbricos"
  },
  {
    id: 5,
    name: "Robot Programable",
    price: 119990,
    image: "/images/juguetes/robot-programable.jpg",
    description: "Robot educativo programable con Scratch y Python"
  },
  {
    id: 6,
    name: "Kit de Arte y Manualidades",
    price: 34990,
    image: "/images/juguetes/kit-arte.jpg",
    description: "Set completo de materiales para manualidades creativas"
  }
];

export default function JuguetesPage() {
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
              🧸 Juguetes & Diversión
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Juguetes educativos y de entretenimiento para todas las edades
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {JUGUETES_PRODUCTS.map((product) => (
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