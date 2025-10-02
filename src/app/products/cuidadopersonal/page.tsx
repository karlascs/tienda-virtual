'use client';

import Header from "@/components/Header";
import AnimatedFooter from "@/components/AnimatedFooter";

/**
 * Productos de Cuidado Personal - IZA & CAS
 * 
 * Categoría dedicada al cuidado personal y bienestar
 * Incluye: máquinas de afeitar, productos de relajación, cuidado corporal
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos reales de productos de cuidado personal con imágenes subidas
const CUIDADO_PERSONAL_PRODUCTS = [
  // === CATEGORÍA MÁQUINAS DE AFEITAR ===
  {
    id: 1,
    name: "Máquina de Afeitar Hair Clipper",
    price: 19990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/D7ZIiz5Y6d+aS7k2eSaPUA==.jpg",
    description: "Máquina de afeitar profesional Hair Clipper con múltiples accesorios",
    category: "Máquinas de Afeitar"
  },
  {
    id: 2,
    name: "Máquina de Afeitar Multifuncional",
    price: 24990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarmultifuncional/b3o3V8FSay3NQ9Bua8tQSw==.jpg",
    description: "Afeitadora multifuncional 3 en 1 para cara y cuerpo",
    category: "Máquinas de Afeitar"
  },
  {
    id: 3,
    name: "Máquina de Afeitar Pulidora de Barba Recargable",
    price: 22990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/3rpc0+Ae9pL6tZjZRPoCw==.jpg",
    description: "Pulidora de barba recargable con precisión profesional",
    category: "Máquinas de Afeitar"
  },

  // === CATEGORÍA RELAJACIÓN ===
  {
    id: 4,
    name: "Humidificador de Aire Ambientador de Astronauta",
    price: 29990,
    image: "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/3oVdO08plBbOfX86GWw38w==.jpg",
    description: "Humidificador con diseño de astronauta, crea ambiente relajante con luces LED",
    category: "Relajación"
  },
  {
    id: 5,
    name: "Masajeador Muscular",
    price: 34990,
    image: "/images/cuidadopersonal/relajación/masajeadormuscular/Kpwq0A3r+yaBphF1+uxjpQ==.jpg",
    description: "Masajeador muscular eléctrico para alivio de tensiones y relajación",
    category: "Relajación"
  }
];

export default function CuidadoPersonalPage() {
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Cuidado Personal
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Descubre nuestra selección de productos para tu cuidado personal y bienestar
            </p>
          </div>

          {/* Grid de productos con animaciones */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            padding: '20px 0',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {CUIDADO_PERSONAL_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Imagen del producto */}
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    {/* Badge de categoría */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(102, 126, 234, 0.9)',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {product.category}
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#333',
                      lineHeight: '1.4'
                    }}>
                      {product.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '15px',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>

                    {/* Precio y botones */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '15px'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#667eea',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        ${product.price.toLocaleString()}
                      </span>
                      
                      <button style={{
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#5a67d8';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#667eea';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                      }}
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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