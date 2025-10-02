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

// Datos reales de productos de tecnología con imágenes subidas
const TECNOLOGIA_PRODUCTS = [
  // === CATEGORÍA AUDÍFONOS ===
  {
    id: 1,
    name: "Audífonos Inalámbricos IRM",
    price: 24990,
    image: "/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg",
    description: "Audífonos inalámbricos IRM con cancelación de ruido y excelente calidad de sonido",
    category: "Audífonos"
  },

  // === CATEGORÍA CÁMARAS ===
  {
    id: 2,
    name: "Cámara de Seguridad 360° Tipo Ampolleta",
    price: 35990,
    image: "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/J1AhCK8dbjhy+nHwWgFfA==.jpg",
    description: "Cámara de seguridad con rotación 360°, fácil instalación tipo ampolleta",
    category: "Cámaras"
  },
  {
    id: 3,
    name: "Cámara de Seguridad Exteriores 360° IP66",
    price: 49990,
    image: "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/IyGF+Wh1RSRZPSeKnsDztw==.jpg",
    description: "Cámara resistente al agua IP66 para exteriores con visión 360°",
    category: "Cámaras"
  },
  {
    id: 4,
    name: "Mini Cámara Espía HD",
    price: 19990,
    image: "/images/tecnologia/camaras/minicamarapiahd/I4w7ZNf27PNKQWFCgXXLCg==.jpg",
    description: "Mini cámara discreta con grabación HD, perfecta para seguridad personal",
    category: "Cámaras"
  },

  // === CATEGORÍA CELULAR ===
  {
    id: 5,
    name: "Cable USB Tipo C para Celular",
    price: 4990,
    image: "/images/tecnologia/celular/cableusbtipocparacelurar/D2MQz8GnMZp0qgQUh9H4rA==.jpg",
    description: "Cable USB-C de carga rápida, compatible con la mayoría de smartphones modernos",
    category: "Celular"
  },
  {
    id: 6,
    name: "Cargador Dual USB Tipo C + Cable",
    price: 12990,
    image: "/images/tecnologia/celular/cargadordualusbtipoc+cable/NS4pd30MkTNPoI0wZAYWw==.jpg",
    description: "Cargador de pared dual con puerto USB-C y cable incluido",
    category: "Celular"
  },
  {
    id: 7,
    name: "Cargador Dual USB Tipo C",
    price: 9990,
    image: "/images/tecnologia/celular/cargadordualusbtipoc/wPkBUpS3C5Jl2s607N1tQ==.jpg",
    description: "Cargador dual USB-C para cargar dos dispositivos simultáneamente",
    category: "Celular"
  },
  {
    id: 8,
    name: "Cargador iPhone + Cable",
    price: 14990,
    image: "/images/tecnologia/celular/cargadoriphone+cable/C9qVyXDkwWRMaBh3PIW9rg==.jpg",
    description: "Cargador oficial Lightning para iPhone con cable incluido",
    category: "Celular"
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