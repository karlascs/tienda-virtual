'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ProductCarousel from '@/components/ProductCarousel';
import ProductModal from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';

/**
 * Productos de Cuidado Personal - IZA & CAS
 * 
 * Categoría dedicada al cuidado personal y bienestar
 * Incluye: máquinas de afeitar, productos de relajación, cuidado corporal
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
            {CUIDADO_PERSONAL_PRODUCTS.map((product) => {
              // Mapeo de imágenes adicionales para productos con múltiples fotos
              const imageMap: Record<number, string[]> = {
                1: [
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/D7ZIiz5Y6d+aS7k2eSaPUA==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/e3ZijEor0YkoWs5JZXMXXA==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/n7J9bMqXxmeTHp45v5dFQ==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/SEe70y9t1wsdoOZr7MXfzA==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarhairclipper/zX0jzmqXa6myFvtL2Lh91A==.jpg"
                ],
                3: [
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/3rpc0+Ae9pL6tZjZRPoCw==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/qtPew3l7+2rOsS0fSYdCw==.jpg",
                  "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarpulidoradebarbarecargable/TvMfRbDSemiW4s4OZF2i5A==.jpg"
                ],
                4: [
                  "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/3oVdO08plBbOfX86GWw38w==.jpg",
                  "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/EfvNk9khaADuQFTagkTM2A==.jpg",
                  "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/K2er3cqRyrD20Gp4YVYXcA==.jpg",
                  "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/oNGrkclPWIMOadlkG8rURA==.jpg",
                  "/images/cuidadopersonal/relajación/humidificadordeaireambientadordeastronauta/z3v3RbXFk5j3kvOYogB6Cg==.jpg"
                ],
                5: [
                  "/images/cuidadopersonal/relajación/masajeadormuscular/fdfee1S1HlUDwKwr5SJyxA==.jpg",
                  "/images/cuidadopersonal/relajación/masajeadormuscular/hpj7jntPsI16KQUqdhaTUw==.jpg",
                  "/images/cuidadopersonal/relajación/masajeadormuscular/k8n9kG+yI5mnFnCRgx4YQ==.jpg",
                  "/images/cuidadopersonal/relajación/masajeadormuscular/Kpwq0A3r+yaBphF1+uxjpQ==.jpg",
                  "/images/cuidadopersonal/relajación/masajeadormuscular/vS8TQgxsSwqgVMYMfJNREA==.jpg"
                ]
              };
              
              // Usar el mapeo de imágenes o imagen única
              const images = imageMap[product.id] || [product.image];
              const productWithImages = { ...product, images };
              
              return (
              <div key={product.id} className="card">
                <ProductCarousel 
                  images={productWithImages.images} 
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
                      onClick={() => handleAddToCart(productWithImages)}
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
                      onClick={() => handleViewDetails(productWithImages)}
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
              );
            })}
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