import Header from "@/components/Header";

/**
 * Productos de Juguetes - Casa Viva
 * 
 * Categoría dedicada a juguetes y entretenimiento infantil
 * Incluye: juguetes educativos, electrónicos, creativos
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
    description: "Robot educativo programable para aprender coding"
  },
  {
    id: 6,
    name: "Kit de Arte y Manualidades",
    price: 34990,
    image: "/images/juguetes/kit-arte.jpg",
    description: "Set completo de materiales para manualidades creativas"
  },
  {
    id: 7,
    name: "Bicicleta Eléctrica Infantil",
    price: 189990,
    image: "/images/juguetes/bici-electrica-ninos.jpg",
    description: "Bicicleta eléctrica segura para niños de 8-12 años"
  },
  {
    id: 8,
    name: "Casa de Muñecas Moderna",
    price: 94990,
    image: "/images/juguetes/casa-munecas.jpg",
    description: "Casa de muñecas de madera con muebles y accesorios incluidos"
  },
  {
    id: 9,
    name: "Set de Ciencia para Niños",
    price: 42990,
    image: "/images/juguetes/kit-ciencia.jpg",
    description: "Kit de experimentos científicos seguros y educativos"
  },
  {
    id: 10,
    name: "Consola de Videojuegos Portátil",
    price: 159990,
    image: "/images/juguetes/consola-portatil.jpg",
    description: "Consola portátil con 200+ juegos clásicos incluidos"
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
              🧸 Juguetes
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Juguetes educativos y entretenimiento para todas las edades
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