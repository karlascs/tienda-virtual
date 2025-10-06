'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import WishlistButton from '@/components/WishlistButton';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

/**
 * Productos de Actividad - IZA & CAS
 * 
 * Categoría dedicada a deportes, fitness y actividades al aire libre
 * Incluye: camping, piscina, playa, deportes
 * Con funcionalidad completa de carrito y modal
 */

// Datos reales de productos de actividad con imágenes subidas
const ACTIVIDAD_PRODUCTS: Product[] = [
  // === CATEGORÍA CAMPING ===
  {
    id: 1,
    name: "Binoculares 30x60 Prismáticos",
    price: 9990,
    image: "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
    images: [
      "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
      "/images/actividad/camping/binocular30X60prismaticos/k9y4+nAPEtE0muZXaq8oNQ==.jpg",
      "/images/actividad/camping/binocular30X60prismaticos/MCL5vAUYall0XfIBDeNbw==.jpg"
    ],
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
    image: "/images/actividad/camping/hamaca200X100cm/5x5ySvyXdMCgMnncDNboA==.jpg",
    images: [
      "/images/actividad/camping/hamaca200X100cm/5x5ySvyXdMCgMnncDNboA==.jpg",
      "/images/actividad/camping/hamaca200X100cm/ijsQlCHMhp5UvQsYlcIBFw==.jpg",
      "/images/actividad/camping/hamaca200X100cm/oS0UutmGBbe6RtpE01TZIg==.jpg"
    ],
    description: "Hamaca resistente para camping y descanso al aire libre",
    category: "Camping"
  },
  {
    id: 4,
    name: "Lona Impermeable Multiuso 4x6m",
    price: 14990,
    image: "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/EzYwQc9YP4gH4Pc9yTAxw==.jpg",
    images: [
      "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/EzYwQc9YP4gH4Pc9yTAxw==.jpg",
      "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/tKa13NmESpEKfw4IPyaDw==.jpg"
    ],
    description: "Lona impermeable de uso múltiple, perfecta para camping y protección",
    category: "Camping"
  },

  // === CATEGORÍA DEPORTES ===
  {
    id: 5,
    name: "Chaleco Deportivo para Correr",
    price: 8990,
    image: "/images/actividad/deporte/chalecodeportivoparacorrer/9xJn0ARIT5KPc0gchC3lQA==.jpg",
    images: [
      "/images/actividad/deporte/chalecodeportivoparacorrer/9xJn0ARIT5KPc0gchC3lQA==.jpg",
      "/images/actividad/deporte/chalecodeportivoparacorrer/k0FPDJNfSxks8C4GmEFptA==.jpg",
      "/images/actividad/deporte/chalecodeportivoparacorrer/KpsvkqKI6v5yk9DcLl6sQ==.jpg",
      "/images/actividad/deporte/chalecodeportivoparacorrer/rB4kGRQ4Pz1D7zS23f+xhg==.jpg",
      "/images/actividad/deporte/chalecodeportivoparacorrer/xW82e8+omkul5xXmRjsTYg==.jpg"
    ],
    description: "Chaleco deportivo transpirable para running y ejercicio",
    category: "Deportes"
  },
  {
    id: 6,
    name: "Pesas de Arena para Tobillo 1kg",
    price: 6990,
    image: "/images/actividad/deporte/pesasdearenaparaeltobillo1k/+nxIaXr7Upd+OJsLIq41hA==.jpg",
    images: [
      "/images/actividad/deporte/pesasdearenaparaeltobillo1k/+nxIaXr7Upd+OJsLIq41hA==.jpg",
      "/images/actividad/deporte/pesasdearenaparaeltobillo1k/nnebMzbQx6S0Hby6vjIWiQ==.jpg",
      "/images/actividad/deporte/pesasdearenaparaeltobillo1k/ShKofEZvQ1pbY5VMmUl6ug==.jpg",
      "/images/actividad/deporte/pesasdearenaparaeltobillo1k/VF7aKKsC+gdZycVGnlgCA==.jpg",
      "/images/actividad/deporte/pesasdearenaparaeltobillo1k/VWeCfgHBrOgrSLBkIWrXtQ==.jpg"
    ],
    description: "Pesas ajustables de arena para entrenamiento de piernas",
    category: "Deportes"
  },

  // === CATEGORÍA PISCINA ===
  {
    id: 7,
    name: "Alfombra de Agua para Niños",
    price: 8990,
    image: "/images/actividad/piscina/alfombradeaguaparaniños/9qIpzMkV2X50QN6ICtOfqw==.jpg",
    images: [
      "/images/actividad/piscina/alfombradeaguaparaniños/9qIpzMkV2X50QN6ICtOfqw==.jpg",
      "/images/actividad/piscina/alfombradeaguaparaniños/CNf6zPNbQyKccFYBvTnadg==.jpg",
      "/images/actividad/piscina/alfombradeaguaparaniños/N0QIqZ4K15BUiAVms9EDzg==.jpg"
    ],
    description: "Alfombra de agua inflable para diversión de niños en verano",
    category: "Piscina"
  },
  {
    id: 8,
    name: "Deslizadero Acuático Tobogán",
    price: 15990,
    image: "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/i2VyW5OEQD29GTSUIf1eQ==.jpg",
    images: [
      "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/i2VyW5OEQD29GTSUIf1eQ==.jpg",
      "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/O3TUgztVA++oKZ01NNTNw==.jpg",
      "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/YIjKOdvJG8VjIkZg9DgHVw==.jpg"
    ],
    description: "Tobogán acuático inflable para diversión en piscina y jardín",
    category: "Piscina"
  },
  {
    id: 9,
    name: "Piscina Inflable 2.62x1.75x0.51m",
    price: 19990,
    image: "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/9XjN7Un9YTYuJB6BZEzJZw==.jpg",
    images: [
      "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/9XjN7Un9YTYuJB6BZEzJZw==.jpg",
      "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/F+kLoEBBQp6wFYBWT8Sy9A==.jpg",
      "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/T8cBbYSZF1U42lTgTom4zA==.jpg"
    ],
    description: "Piscina inflable familiar de gran tamaño para diversión en el jardín",
    category: "Piscina"
  },
  
  // === CATEGORÍA PLAYA ===
  {
    id: 10,
    name: "Balde de Playa",
    price: 3990,
    image: "/images/actividad/playa/baldeparaplaya/5xXXiRCdV9mpv0YAxtL+hQ==.jpg",
    images: [
      "/images/actividad/playa/baldeparaplaya/5xXXiRCdV9mpv0YAxtL+hQ==.jpg",
      "/images/actividad/playa/baldeparaplaya/KSCZvvoTVpazMv6ZLbiJUA==.jpg"
    ],
    description: "Set de balde y pala para juegos en la playa",
    category: "Playa"
  },
  {
    id: 11,
    name: "Carpa para Playa",
    price: 11990,
    image: "/images/actividad/playa/carpaparaplaya/3uZc2I9d15iuH9fW81ybiw==.jpg",
    images: [
      "/images/actividad/playa/carpaparaplaya/3uZc2I9d15iuH9fW81ybiw==.jpg",
      "/images/actividad/playa/carpaparaplaya/6NN8TE7mtb56ibEtLY3+w==.jpg",
      "/images/actividad/playa/carpaparaplaya/lt6QN72GHjIFUzz4rsYuA==.jpg"
    ],
    description: "Carpa portátil con protección UV para días de playa",
    category: "Playa"
  },
  {
    id: 12,
    name: "Quitasol de Playa",
    price: 8990,
    image: "/images/actividad/playa/quitasol/RJtwHp8l2Sx+5rn1SV7eiA==.jpg",
    images: ["/images/actividad/playa/quitasol/RJtwHp8l2Sx+5rn1SV7eiA==.jpg"],
    description: "Quitasol portátil con protección UV para la playa",
    category: "Playa"
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
              <div key={product.id} className="card" style={{ position: 'relative' }}>
                <WishlistButton 
                  product={product} 
                  className="onCard" 
                />
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  onClick={() => handleViewDetails(product)}
                />
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