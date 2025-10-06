'use client';

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCarousel from "@/components/ProductCarousel";
import ProductModal from "@/components/ProductModal";
import WishlistButton from "@/components/WishlistButton";
import FilterPanel from "@/components/FilterPanel";
import { useCart } from "@/context/CartContext";
import { useFilters } from "@/context/FilterContext";
import styles from "@/styles/tecnologia.module.css";

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
    images: [
      "/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/ubbVX0vZLdxoCnlR0R15lA==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/v47zqCYPFOJfgeLZigcV0w==.jpg"
    ],
    description: "Audífonos inalámbricos IRM con cancelación de ruido y excelente calidad de sonido",
    category: "Audífonos"
  },

  // === CATEGORÍA CÁMARAS ===
  {
    id: 2,
    name: "Cámara de Seguridad 360° Tipo Ampolleta",
    price: 35990,
    image: "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/J1AhCK8dbjhy+nHwWgFfA==.jpg",
    images: [
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/J1AhCK8dbjhy+nHwWgFfA==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/cEFBWiCJt9NR7ruJKFX4Jg==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/iTKKzaJUaquV6Q+XWBs9Lw==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/lArfNVY6byYKzlCGFfOSMg==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/Qkcmd2feBIkdRKpjEYstzA==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/zAO0y9lUxdI2cTqjulRw==.jpg"
    ],
    description: "Cámara de seguridad con rotación 360°, fácil instalación tipo ampolleta",
    category: "Cámaras"
  },
  {
    id: 3,
    name: "Cámara de Seguridad Exteriores 360° IP66",
    price: 49990,
    image: "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/IyGF+Wh1RSRZPSeKnsDztw==.jpg",
    images: [
      "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/IyGF+Wh1RSRZPSeKnsDztw==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/bTevcTlUYWcSW1OL6AbhYw==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/MDc9tatdfk5AaZnvZuBnlA==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/mdDiAZKBMPQXUaFehB8+kA==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360°ip66/X1g233Zzet6K2dlEmgvjqQ==.jpg"
    ],
    description: "Cámara resistente al agua IP66 para exteriores con visión 360°",
    category: "Cámaras"
  },
  {
    id: 4,
    name: "Mini Cámara Espía HD",
    price: 19990,
    image: "/images/tecnologia/camaras/minicamarapiahd/I4w7ZNf27PNKQWFCgXXLCg==.jpg",
    images: [
      "/images/tecnologia/camaras/minicamarapiahd/I4w7ZNf27PNKQWFCgXXLCg==.jpg",
      "/images/tecnologia/camaras/minicamarapiahd/mWEdsUvA4NYrduqWvVsRCQ==.jpg"
    ],
    description: "Cámara espía discreta de alta definición, ideal para seguridad personal",
    category: "Cámaras"
  },

  // === CATEGORÍA CELULAR ===
  {
    id: 5,
    name: "Cable USB Tipo C para Celular",
    price: 4990,
    image: "/images/tecnologia/celular/cableusbtipocparacelurar/D2MQz8GnMZp0qgQUh9H4rA==.jpg",
    images: [
      "/images/tecnologia/celular/cableusbtipocparacelurar/D2MQz8GnMZp0qgQUh9H4rA==.jpg",
      "/images/tecnologia/celular/cableusbtipocparacelurar/k+IQgeQMS97PpnsBj7Ps+g==.jpg",
      "/images/tecnologia/celular/cableusbtipocparacelurar/MZbCEyazJdMASSTwVGmg==.jpg"
    ],
    description: "Cable USB tipo C de alta calidad para carga rápida de celulares",
    category: "Celular"
  },
  {
    id: 6,
    name: "Cargador Dual USB Tipo C",
    price: 12990,
    image: "/images/tecnologia/celular/cargadordualusbtipoc/wPkBUpS3C5Jl2s607N1tQ==.jpg",
    images: [
      "/images/tecnologia/celular/cargadordualusbtipoc/wPkBUpS3C5Jl2s607N1tQ==.jpg"
    ],
    description: "Cargador dual con puerto USB tipo C para carga rápida de dispositivos",
    category: "Celular"
  },
  {
    id: 7,
    name: "Cargador iPhone + Cable",
    price: 15990,
    image: "/images/tecnologia/celular/cargadoriphone+cable/C9qVyXDkwWRMaBh3PIW9rg==.jpg",
    images: [
      "/images/tecnologia/celular/cargadoriphone+cable/C9qVyXDkwWRMaBh3PIW9rg==.jpg",
      "/images/tecnologia/celular/cargadoriphone+cable/vp1+NRBYp4IHMymUwFErPQ==.jpg"
    ],
    description: "Cargador original para iPhone con cable Lightning incluido",
    category: "Celular"
  }
];

export default function TecnologiaPage() {
  const { addToCart } = useCart();
  const { applyFilters } = useFilters();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtros a los productos
  const filteredProducts = applyFilters(TECNOLOGIA_PRODUCTS);

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
              margin: '0 auto 24px auto'
            }}>
              Tecnología moderna para tu día a día
            </p>
            
            {/* Controles de filtros */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              
              <button
                onClick={() => setShowFilters(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'var(--brand)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
                Filtros
              </button>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="card" style={{ position: 'relative' }}>
                {/* Botón de wishlist */}
                <WishlistButton 
                  product={product} 
                  className="onCard" 
                />
                
                <ProductCarousel 
                  images={product.images} 
                  productName={product.name}
                  className="card-carousel"
                />
                <div className="body" style={{ padding: '16px' }}>
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
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
      
      {/* Panel de filtros */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        products={TECNOLOGIA_PRODUCTS}
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