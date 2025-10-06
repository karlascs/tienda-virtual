'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import WishlistButton from '@/components/WishlistButton';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

/**
 * Productos de Cuidado Personal - IZA & CAS
 * 
 * Categoría dedicada al cuidado personal y bienestar
 * Incluye: máquinas de afeitar, productos de relajación, cuidado corporal
 * Con funcionalidad completa de carrito y modal
 */

// Datos reales de productos de cuidado personal con imágenes subidas
const CUIDADO_PERSONAL_PRODUCTS: Product[] = [
  // === CATEGORÍA MÁQUINAS DE AFEITAR ===
  {
    id: 1,
    name: "Máquina de Afeitar Hair Clipper",
    price: 19990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/D7ZIiz5Y6d+aS7k2eSaPUA==.jpg",
    images: ["/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/D7ZIiz5Y6d+aS7k2eSaPUA==.jpg"],
    description: "Máquina de afeitar profesional Hair Clipper con múltiples accesorios",
    category: "Máquinas de Afeitar"
  },
  {
    id: 2,
    name: "Máquina de Afeitar Multifuncional",
    price: 24990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarmultifuncional/b3o3V8FSay3NQ9Bua8tQSw==.jpg",
    images: ["/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarmultifuncional/b3o3V8FSay3NQ9Bua8tQSw==.jpg"],
    description: "Afeitadora multifuncional 3 en 1 para cara y cuerpo",
    category: "Máquinas de Afeitar"
  },
  {
    id: 3,
    name: "Máquina de Afeitar Pulidora de Barba Recargable",
    price: 22990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/3rpc0+Ae9pL6tZjZRPoCw==.jpg",
    images: ["/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/3rpc0+Ae9pL6tZjZRPoCw==.jpg"],
    description: "Pulidora de barba recargable con precisión profesional",
    category: "Máquinas de Afeitar"
  },

  // === CATEGORÍA RELAJACIÓN ===
  {
    id: 4,
    name: "Humidificador de Aire Ambientador de Astronauta",
    price: 29990,
    image: "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/3oVdO08plBbOfX86GWw38w==.jpg",
    images: ["/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/3oVdO08plBbOfX86GWw38w==.jpg"],
    description: "Humidificador con diseño de astronauta, crea ambiente relajante con luces LED",
    category: "Relajación"
  },
  {
    id: 5,
    name: "Masajeador Muscular",
    price: 34990,
    image: "/images/cuidadopersonal/relajación/masajeadormuscular/Kpwq0A3r+yaBphF1+uxjpQ==.jpg",
    images: ["/images/cuidadopersonal/relajación/masajeadormuscular/Kpwq0A3r+yaBphF1+uxjpQ==.jpg"],
    description: "Masajeador muscular eléctrico para alivio de tensiones y relajación",
    category: "Relajación"
  }
];

export default function CuidadoPersonalPage() {
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
              🧴 Cuidado Personal & Bienestar
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Productos para tu cuidado personal y bienestar diario
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {CUIDADO_PERSONAL_PRODUCTS.map((product) => (
              <div key={product.id} className="card" style={{ position: 'relative' }}>
                <WishlistButton 
                  product={product} 
                  className="onCard" 
                />
                
                {/* Tarjeta de producto minimalista */}
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