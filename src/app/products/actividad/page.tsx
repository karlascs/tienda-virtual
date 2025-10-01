'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Productos de Actividad - IZA & CAS
 * 
 * Categoría dedicada a deportes, fitness y actividades al aire libre
 * Incluye: equipos deportivos, fitness, outdoor, recreación
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de actividad (estáticos para MVP)
const ACTIVIDAD_PRODUCTS = [
  {
    id: 1,
    name: "Bicicleta Montaña 27.5''",
    price: 349990,
    image: "/images/actividad/bici-montana.jpg",
    description: "Bicicleta de montaña con suspensión delantera y 21 velocidades"
  },
  {
    id: 2,
    name: "Cinta de Correr Plegable",
    price: 499990,
    image: "/images/actividad/cinta-correr.jpg",
    description: "Cinta de correr eléctrica plegable con pantalla LCD"
  },
  {
    id: 3,
    name: "Set de Pesas Ajustables",
    price: 189990,
    image: "/images/actividad/pesas-ajustables.jpg",
    description: "Juego de mancuernas ajustables de 2.5kg a 24kg cada una"
  },
  {
    id: 4,
    name: "Kayak Inflable 2 Personas",
    price: 279990,
    image: "/images/actividad/kayak-inflable.jpg",
    description: "Kayak inflable resistente con remos y bomba incluidos"
  },
  {
    id: 5,
    name: "Carpa Familiar 6 Personas",
    price: 159990,
    image: "/images/actividad/carpa-familiar.jpg",
    description: "Carpa impermeable con avance y bolsa de transporte"
  },
  {
    id: 6,
    name: "Patineta Eléctrica",
    price: 229990,
    image: "/images/actividad/patineta-electrica.jpg",
    description: "Skateboard eléctrico con control remoto y 25km autonomía"
  }
];

export default function ActividadPage() {
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
              ⚽ Actividad & Deportes
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Equipos deportivos y productos para mantener un estilo de vida activo y saludable
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {ACTIVIDAD_PRODUCTS.map((product) => (
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