import Header from "@/components/Header";

/**
 * Productos de Tecnología - Casa Viva
 * 
 * Categoría dedicada a tecnología y electrónicos
 * Incluye: smartphones, laptops, accesorios tech, gadgets
 */

// Datos de productos de tecnología (estáticos para MVP)
const TECNOLOGIA_PRODUCTS = [
  {
    id: 1,
    name: "Smartphone 128GB",
    price: 299990,
    image: "/images/tecnologia/smartphone-128gb.jpg",
    description: "Smartphone con pantalla AMOLED 6.7' y cámara triple de 108MP"
  },
  {
    id: 2,
    name: "Laptop Gaming 16GB RAM",
    price: 899990,
    image: "/images/tecnologia/laptop-gaming.jpg",
    description: "Laptop para gaming con procesador i7 y tarjeta gráfica RTX"
  },
  {
    id: 3,
    name: "Auriculares Bluetooth Premium",
    price: 129990,
    image: "/images/tecnologia/auriculares-bluetooth.jpg",
    description: "Auriculares inalámbricos con cancelación activa de ruido"
  },
  {
    id: 4,
    name: "Monitor 4K 27 pulgadas",
    price: 349990,
    image: "/images/tecnologia/monitor-4k.jpg",
    description: "Monitor Ultra HD con tecnología IPS y 144Hz"
  },
  {
    id: 5,
    name: "Teclado Mecánico RGB",
    price: 89990,
    image: "/images/tecnologia/teclado-mecanico.jpg",
    description: "Teclado mecánico gaming con switches Cherry MX y RGB"
  },
  {
    id: 6,
    name: "Webcam 4K Profesional",
    price: 79990,
    image: "/images/tecnologia/webcam-4k.jpg",
    description: "Cámara web 4K con micrófono estéreo para streaming"
  },
  {
    id: 7,
    name: "Power Bank 20000mAh",
    price: 39990,
    image: "/images/tecnologia/power-bank.jpg",
    description: "Batería portátil de carga rápida con display LED"
  },
  {
    id: 8,
    name: "Smart Watch Deportivo",
    price: 189990,
    image: "/images/tecnologia/smartwatch-deportivo.jpg",
    description: "Reloj inteligente con GPS y monitoreo de salud 24/7"
  },
  {
    id: 9,
    name: "Router Wi-Fi 6 Mesh",
    price: 159990,
    image: "/images/tecnologia/router-wifi6.jpg",
    description: "Sistema mesh Wi-Fi 6 para cobertura total del hogar"
  },
  {
    id: 10,
    name: "Disco SSD 1TB NVMe",
    price: 89990,
    image: "/images/tecnologia/ssd-1tb.jpg",
    description: "Unidad de estado sólido NVMe Gen 4 ultra rápida"
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
              💻 Tecnología
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Los últimos avances en tecnología y electrónicos para el hogar y oficina
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