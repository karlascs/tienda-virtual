'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Productos de Herramientas - IZA & CAS
 * 
 * Categoría dedicada a herramientas para el hogar y bricolaje
 * Incluye: herramientas eléctricas, manuales, accesorios
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de herramientas (estáticos para MVP)
const HERRAMIENTAS_PRODUCTS = [
  {
    id: 1,
    name: "Taladro Percutor 18V",
    price: 89990,
    image: "/images/herramientas/taladro-percutor.jpg",
    description: "Taladro inalámbrico con batería de litio y múltiples brocas"
  },
  {
    id: 2,
    name: "Sierra Caladora Profesional",
    price: 65990,
    image: "/images/herramientas/sierra-caladora.jpg",
    description: "Sierra caladora eléctrica para cortes precisos en madera y metal"
  },
  {
    id: 3,
    name: "Kit de Destornilladores 32 piezas",
    price: 24990,
    image: "/images/herramientas/kit-destornilladores.jpg",
    description: "Set completo de destornilladores con puntas intercambiables"
  },
  {
    id: 4,
    name: "Soldadora Inverter 200A",
    price: 149990,
    image: "/images/herramientas/soldadora-inverter.jpg",
    description: "Soldadora inverter compacta para trabajos de soldadura MMA"
  },
  {
    id: 5,
    name: "Amoladora Angular 115mm",
    price: 38990,
    image: "/images/herramientas/amoladora-angular.jpg",
    description: "Amoladora angular eléctrica para corte y desbaste"
  },
  {
    id: 6,
    name: "Compresor de Aire 24L",
    price: 119990,
    image: "/images/herramientas/compresor-aire.jpg",
    description: "Compresor de aire silencioso ideal para pistolas de pintura"
  },
  {
    id: 7,
    name: "Nivel Láser Autonivelante",
    price: 78990,
    image: "/images/herramientas/nivel-laser.jpg",
    description: "Nivel láser verde con base magnética y trípode incluido"
  },
  {
    id: 8,
    name: "Caja de Herramientas Metálica",
    price: 45990,
    image: "/images/herramientas/caja-herramientas.jpg",
    description: "Caja de herramientas resistente con compartimentos organizadores"
  }
];

export default function HerramientasPage() {
  const { containerRef, visibleItems } = useScrollAnimationList(HERRAMIENTAS_PRODUCTS.length, 0.2);

  return (
    <>
      <Header />
      
      <main>
        <div className="container">
          {/* Título de la categoría con animación */}
          <AnimatedSection 
            animation="fade-in-up"
            threshold={0.3}
          >
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
                🔧 Herramientas
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '18px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Herramientas profesionales y accesorios para todos tus proyectos de bricolaje
              </p>
            </div>
          </AnimatedSection>

          {/* Grid de productos con animaciones progresivas */}
          <div 
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="grid" 
            style={{ marginBottom: '60px' }}
          >
            {HERRAMIENTAS_PRODUCTS.map((product, index) => (
              <div 
                key={product.id} 
                data-index={index}
                className={`card fade-in-up fade-in-delay-${Math.min(index + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
              >
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
      
      <AnimatedFooter 
        animation="fade-in-up"
        threshold={0.8}
        className="container"
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 IZA & CAS — hecho por karla cuevas
      </AnimatedFooter>
    </>
  );
}