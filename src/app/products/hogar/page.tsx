import Header from "@/components/Header";

/**
 * Productos de Hogar - Casa Viva
 * 
 * Categoría dedicada a electrodomésticos y artículos para el hogar
 * Incluye: electrodomésticos de cocina, limpieza, organización
 */

// Datos de productos de hogar (estáticos para MVP)
const HOGAR_PRODUCTS = [
  {
    id: 1,
    name: "Hervidor Eléctrico Premium",
    price: 45990,
    image: "/images/hogar/hervidor-electrico.webp",
    description: "Hervidor de agua eléctrico con capacidad de 1.7 litros"
  },
  {
    id: 2,
    name: "Batidora de Mano Multifunción",
    price: 32990,
    image: "/images/hogar/batidora-inmersion.avif",
    description: "Batidora de inmersión con múltiples accesorios"
  },
  {
    id: 3,
    name: "Horno Eléctrico 25L",
    price: 89990,
    image: "/images/hogar/horno-electrico.jpg",
    description: "Horno eléctrico compacto perfecto para cocinar en casa"
  },
  {
    id: 4,
    name: "Aspiradora Robot Inteligente",
    price: 159990,
    image: "/images/hogar/aspiradora-robot.jpg",
    description: "Aspiradora robot con navegación inteligente y control por app"
  },
  {
    id: 5,
    name: "Cafetera Express",
    price: 75990,
    image: "/images/hogar/cafetera-express.jpg", 
    description: "Cafetera de espresso con vaporizador de leche integrado"
  },
  {
    id: 6,
    name: "Plancha Vertical a Vapor",
    price: 42990,
    image: "/images/hogar/plancha-vapor.jpg",
    description: "Plancha vertical perfecta para ropa delicada y cortinas"
  }
];

export default function HogarPage() {
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
              Electrodomésticos y artículos esenciales para hacer tu hogar más cómodo y funcional
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {HOGAR_PRODUCTS.map((product) => (
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
        © 2025 Casa Viva.cl — hecho por karla cuevas
      </footer>
    </>
  );
}