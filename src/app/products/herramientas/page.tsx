'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

/**
 * Productos de Herramientas - IZA & CAS
 * 
 * Categoría dedicada a herramientas para el hogar y bricolaje
 * Incluye: herramientas eléctricas, manuales, accesorios
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

// Datos reales de productos de herramientas con imágenes subidas
const HERRAMIENTAS_PRODUCTS = [
  // === CATEGORÍA AUTOMOTRIZ ===
  {
    id: 1,
    name: "Cables Auxiliares para Auto",
    price: 7990,
    image: "/images/herramientas/car/cableAuxiliares/0WNyc+Si42f13LcBw7Uw8A==.jpg",
    description: "Cables auxiliares de alta calidad para arranque de vehículos",
    category: "Automotriz"
  },
  {
    id: 2,
    name: "Compresor de Aire Portátil",
    price: 16990,
    image: "/images/herramientas/car/compresordeaireportatil/6uxYH0xUbI5Ia7hYcbirA==.jpg",
    description: "Compresor portátil para inflar neumáticos y equipos deportivos",
    category: "Automotriz"
  },
  {
    id: 3,
    name: "Espejo Retrovisor con Cámara",
    price: 17990,
    image: "/images/herramientas/car/espejoretrovisorcon camara/Puvs6DbFSFmAOHTx3srljQ==.jpg",
    description: "Espejo retrovisor inteligente con cámara de seguridad integrada",
    category: "Automotriz"
  },
  {
    id: 4,
    name: "Tabla Volante Multifuncional",
    price: 10990,
    image: "/images/herramientas/car/tabavolante/Iovi68LXRxpNSbZYaP1J1Q==.jpg",
    description: "Tabla para volante ajustable, ideal para comer o trabajar en el auto",
    category: "Automotriz"
  },

  // === CATEGORÍA ILUMINACIÓN ===
  {
    id: 5,
    name: "Foco LED AC 200W",
    price: 12990,
    image: "/images/herramientas/iluminacion/focoledacorriente200w/2TSThogXVzL0xN9w3e4OQ==.jpg",
    description: "Foco LED de alta potencia para iluminación exterior",
    category: "Iluminación"
  },
  {
    id: 6,
    name: "Foco LED AC 100W",
    price: 9990,
    image: "/images/herramientas/iluminacion/focoledcorriente100w/9C9rrsRtNG1kyKwEQAQmMg==.jpg",
    description: "Foco LED eficiente para uso doméstico e industrial",
    category: "Iluminación"
  },
  {
    id: 7,
    name: "Foco Solar 260W",
    price: 21990,
    image: "/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg",
    description: "Foco solar de alta potencia con panel integrado",
    category: "Iluminación"
  },
  {
    id: 8,
    name: "Foco Solar 50W con Panel",
    price: 14990,
    image: "/images/herramientas/iluminacion/focosolar50wconpanel/8mEb4UzQDQa8dXrQStOKA==.jpg",
    description: "Foco solar con panel separado y control remoto",
    category: "Iluminación"
  },
  {
    id: 9,
    name: "Foco Solar con Panel 100W",
    price: 9990,
    image: "/images/herramientas/iluminacion/focosolarconpanel100w/6kohZNLgUWtytLE0OMoILw==.jpg",
    description: "Sistema de iluminación solar profesional 100W",
    category: "Iluminación"
  },
  {
    id: 10,
    name: "Foco Solar con Sensor",
    price: 9990,
    image: "/images/herramientas/iluminacion/focosolarconsensor/1RSAVCIjArog3zLC1C4w==.jpg",
    description: "Foco solar automático con sensor de movimiento",
    category: "Iluminación"
  },
  {
    id: 11,
    name: "Foco Solar 50W",
    price: 7990,
    image: "/images/herramientas/iluminacion/focosolarr50w/+JYijteB0oPddgFJiP43jw==.jpg",
    description: "Foco solar económico para jardines y patios",
    category: "Iluminación"
  },
  {
    id: 12,
    name: "Foco Solar Triple",
    price: 14990,
    image: "/images/herramientas/iluminacion/focosolartriple/A1fBJ9jMYFkHu9fHm6Uvrw==.jpg",
    description: "Sistema de iluminación solar con tres focos direccionales",
    category: "Iluminación"
  },
  {
    id: 13,
    name: "Foco Solar Triple Panel Separado",
    price: 14990,
    image: "/images/herramientas/iluminacion/focosolartriplepanelseparado/PXkDMxA8s9Cl5nYRxyl9Yw==.jpg",
    description: "Sistema triple con panel solar independiente",
    category: "Iluminación"
  },
  {
    id: 14,
    name: "Lámpara Bola de Cristal 8cm",
    price: 5990,
    image: "/images/herramientas/iluminacion/lamparaboladecristalconfigura8cm/Xz7t1T5zVyae8EQYL+IOjQ==.jpg",
    description: "Lámpara decorativa de cristal configurable con colores",
    category: "Iluminación"
  },
  {
    id: 15,
    name: "Lámpara de Escritorio LED",
    price: 9990,
    image: "/images/herramientas/iluminacion/lamparadeescritorio/+37x1lodfAFSpQlc0NdfHQ==.jpg",
    description: "Lámpara LED ajustable para escritorio y estudio",
    category: "Iluminación"
  },
  {
    id: 16,
    name: "Lámpara Espanta Cucos Proyector",
    price: 4990,
    image: "/images/herramientas/iluminacion/lamparaespantacucosproyectorestrellas/5o0rbEbKIKC9e1fl8ilEWA==.jpg",
    description: "Lámpara proyector de estrellas con función espanta insectos",
    category: "Iluminación"
  },
  {
    id: 17,
    name: "Linterna Parlante Bluetooth",
    price: 9990,
    image: "/images/herramientas/iluminacion/linternaparlante/CnLlWchpCm1Cwn+7DXo4Ag==.jpg",
    description: "Linterna LED con parlante Bluetooth integrado",
    category: "Iluminación"
  },
  {
    id: 18,
    name: "Linterna Solar LED Recargable",
    price: 9990,
    image: "/images/herramientas/iluminacion/linternasolarledrecargableusb/+3quwlIYcA3ZN683T4klSw==.jpg",
    description: "Linterna solar con carga USB y múltiples modos",
    category: "Iluminación"
  },
  {
    id: 19,
    name: "Linterna LED SWAT Recargable",
    price: 9990,
    image: "/images/herramientas/iluminacion/liternaledswatrecargable/E0hJPQE7ZsUyrFX6syjPA==.jpg",
    description: "Linterna táctica LED de alta potencia recargable",
    category: "Iluminación"
  },
  {
    id: 20,
    name: "Panel de Luz 36X25cm con Trípode",
    price: 19990,
    image: "/images/herramientas/iluminacion/paneldeluz36X25cmtripodecontrol/F6Pu0H12fsWLK4O7MribQ==.jpg",
    description: "Panel de luz LED profesional con trípode y control remoto",
    category: "Iluminación"
  }
];

export default function HerramientasPage() {
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
              🔧 Herramientas & Equipos
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Herramientas de calidad para tus proyectos de hogar y auto
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {HERRAMIENTAS_PRODUCTS.map((product) => {
              // Agregar propiedad images dinámicamente para compatibilidad
              const productWithImages = { ...product, images: [product.image] };
              return (
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