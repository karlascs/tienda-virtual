'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCarousel from '@/components/ProductCarousel';
import ProductModal from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';

/**
 * Productos de Actividad - IZA & CAS
 * 
 * Categoría dedicada a deportes, fitness y actividades al aire libre
 * Incluye: camping, piscina, playa, deportes
 * Con funcionalidad completa de carrito y modal
 */

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category: string;
}

// Datos reales de productos de actividad con imágenes subidas
const ACTIVIDAD_PRODUCTS: Product[] = [
  // === CATEGORÍA CAMPING ===
  {
    id: 1,
    name: "Binoculares 30x60 Prismáticos",
    price: 9990,
    image: "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
    images: ["/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg"],
    description: "Binoculares profesionales con zoom 30x60 para observación de naturaleza y camping",
    category: "Camping"
  },
  {
    id: 2,
    name: "Colchón Inflable 1 Plaza",
    price: 12990,
    image: "/images/actividad/camping/colchonesinfables1plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg",
    images: ["/images/actividad/camping/colchonesinfables1plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg"],
    description: "Colchón inflable cómodo para una persona, ideal para camping y visitas",
    category: "Camping"
  },
  {
    id: 3,
    name: "Hamaca 200x100cm",
    price: 7990,
    image: "/images/actividad/camping/hamaca200X100cm/GHRKZHZQBgC3Kt0P+FHhAw==.jpg",
    images: ["/images/actividad/camping/hamaca200X100cm/GHRKZHZQBgC3Kt0P+FHhAw==.jpg"],
    description: "Hamaca resistente para camping y descanso al aire libre",
    category: "Camping"
  },
  {
    id: 4,
    name: "Lona Impermeable Multiuso 4x6m",
    price: 14990,
    image: "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/XzQiJJ5+DlOqXMK+7Z9rYQ==.jpg",
    images: ["/images/actividad/camping/lonaimpermeablesmultiuso4X6m/XzQiJJ5+DlOqXMK+7Z9rYQ==.jpg"],
    description: "Lona impermeable de uso múltiple, perfecta para camping y protección",
    category: "Camping"
  },

  // === CATEGORÍA DEPORTES ===
  {
    id: 5,
    name: "Chaleco Deportivo para Correr",
    price: 8990,
    image: "/images/actividad/deporte/chalecodeportivoparacorrer/lj4Ni4YRRWMm73LdlMDFEw==.jpg",
    images: ["/images/actividad/deporte/chalecodeportivoparacorrer/lj4Ni4YRRWMm73LdlMDFEw==.jpg"],
    description: "Chaleco deportivo transpirable para running y ejercicio",
    category: "Deportes"
  },
  {
    id: 6,
    name: "Pesas de Arena para Tobillo 1kg",
    price: 6990,
    image: "/images/actividad/deporte/pesasdearenaparaeltobillo1k/8Wa+YNw8Uj7VkmB+MgOLBw==.jpg",
    images: ["/images/actividad/deporte/pesasdearenaparaeltobillo1k/8Wa+YNw8Uj7VkmB+MgOLBw==.jpg"],
    description: "Pesas ajustables de arena para entrenamiento de piernas",
    category: "Deportes"
  },

  // === CATEGORÍA PISCINA ===
  {
    id: 7,
    name: "Alfombra de Agua para Niños",
    price: 8990,
    image: "/images/actividad/piscina/alfombradeaguaparaniños/Sn+5jVTpJ3k4Fub9q2JZpQ==.jpg",
    images: ["/images/actividad/piscina/alfombradeaguaparaniños/Sn+5jVTpJ3k4Fub9q2JZpQ==.jpg"],
    description: "Alfombra de agua inflable para diversión de niños en verano",
    category: "Piscina"
  },
  {
    id: 8,
    name: "Deslizadero Acuático Tobogán",
    price: 15990,
    image: "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/l5sT9wJOUvkKOBIyj+jWHw==.jpg",
    images: ["/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/l5sT9wJOUvkKOBIyj+jWHw==.jpg"],
    description: "Tobogán acuático inflable para diversión en piscina y jardín",
    category: "Piscina"
  }
];

export default function ActividadPage() {
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
              🏃‍♂️ Actividad & Deportes
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Productos para deportes y actividades al aire libre
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {ACTIVIDAD_PRODUCTS.map((product) => (
              <div key={product.id} className="card">
                <ProductCarousel 
                  images={product.images} 
                  productName={product.name}
                  className="card-carousel"
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