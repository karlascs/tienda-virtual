'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductCarousel from "@/components/ProductCarousel";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

/**
 * Productos de Tecnología - IZA & CAS
 * 
 * Categoría dedicada a tecnología y electrónicos
 * Incluye: audífonos, cámaras, accesorios celular
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

// Datos reales de productos de tecnología con imágenes subidas
const TECNOLOGIA_PRODUCTS: Product[] = [
  // === CATEGORÍA AUDÍFONOS ===
  {
    id: 1,
    name: "Audífonos Inalámbricos IRM",
    price: 24990,
    image: "/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg",
    images: ["/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg"],
    description: "Audífonos inalámbricos IRM con cancelación de ruido y excelente calidad de sonido",
    category: "Audífonos"
  },

  // === CATEGORÍA CÁMARAS ===
  {
    id: 2,
    name: "Cámara de Seguridad 360° Tipo Ampolleta",
    price: 35990,
    image: "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/J1AhCK8dbjhy+nHwWgFfA==.jpg",
    images: ["/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/J1AhCK8dbjhy+nHwWgFfA==.jpg"],
    description: "Cámara de seguridad con rotación 360°, fácil instalación tipo ampolleta",
    category: "Cámaras"
  },
  {
    id: 3,
    name: "Cámara de Seguridad Exteriores 360° IP66",
    price: 49990,
    image: "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/IyGF+Wh1RSRZPSeKnsDztw==.jpg",
    images: ["/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/IyGF+Wh1RSRZPSeKnsDztw==.jpg"],
    description: "Cámara resistente al agua IP66 para exteriores con visión 360°",
    category: "Cámaras"
  },
  {
    id: 4,
    name: "Mini Cámara Espía HD",
    price: 19990,
    image: "/images/tecnologia/camaras/minicamarapiahd/I4w7ZNf27PNKQWFCgXXLCg==.jpg",
    images: ["/images/tecnologia/camaras/minicamarapiahd/I4w7ZNf27PNKQWFCgXXLCg==.jpg"],
    description: "Cámara espía discreta de alta definición, ideal para seguridad personal",
    category: "Cámaras"
  },

  // === CATEGORÍA CELULAR ===
  {
    id: 5,
    name: "Cable USB Tipo C para Celular",
    price: 4990,
    image: "/images/tecnologia/celular/cableusbtipocparacelurar/D2MQz8GnMZp0qgQUh9H4rA==.jpg",
    images: ["/images/tecnologia/celular/cableusbtipocparacelurar/D2MQz8GnMZp0qgQUh9H4rA==.jpg"],
    description: "Cable USB tipo C de alta calidad para carga rápida de celulares",
    category: "Celular"
  },
  {
    id: 6,
    name: "Cargador Dual USB Tipo C",
    price: 12990,
    image: "/images/tecnologia/celular/cargadordualusbtipoc/wPkBUpS3C5Jl2s607N1tQ==.jpg",
    images: ["/images/tecnologia/celular/cargadordualusbtipoc/wPkBUpS3C5Jl2s607N1tQ==.jpg"],
    description: "Cargador dual con puerto USB tipo C para carga rápida de dispositivos",
    category: "Celular"
  },
  {
    id: 7,
    name: "Cargador iPhone + Cable",
    price: 15990,
    image: "/images/tecnologia/celular/cargadoriphone+cable/C9qVyXDkwWRMaBh3PIW9rg==.jpg",
    images: ["/images/tecnologia/celular/cargadoriphone+cable/C9qVyXDkwWRMaBh3PIW9rg==.jpg"],
    description: "Cargador original para iPhone con cable Lightning incluido",
    category: "Celular"
  }
];

export default function TecnologiaPage() {
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
              📱 Tecnología & Electrónicos
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Tecnología moderna para tu día a día
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {TECNOLOGIA_PRODUCTS.map((product) => (
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