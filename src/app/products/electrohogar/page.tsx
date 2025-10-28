'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import WishlistButton from "@/components/WishlistButton";
import FilterPanel from "@/components/FilterPanel";
import { useCart } from "@/context/CartContext";
import { useFilters } from "@/context/FilterContext";
import { Product } from "@/data/products";

/**
 * Productos de Electro Hogar - IZA & CAS
 * 
 * Categoría especializada en electrodomésticos para el hogar
 * Incluye: electrodomésticos grandes, pequeños electrodomésticos, 
 * aspiradoras, aire acondicionado, refrigeración, etc.
 */

// Productos de Electro Hogar
const ELECTRO_HOGAR_PRODUCTS: Product[] = [
  {
    id: 300,
    name: "Extractor de Jugo 350ml",
    price: 24990,
    images: [
      "/images/electro hogar/extratordejugo350ml/9aJRQs3Ph4LYCaXEq6K4AA==.jpg",
      "/images/electro hogar/extratordejugo350ml/s99tocAwMQRG+51qUCP98Q==.jpg",
      "/images/electro hogar/extratordejugo350ml/WeCvon0hv1wQeITYTZVjA==.jpg",
      "/images/electro hogar/extratordejugo350ml/xfssgrCksblq+4LEZ1NerA==.jpg"
    ],
    image: "/images/electro hogar/extratordejugo350ml/9aJRQs3Ph4LYCaXEq6K4AA==.jpg",
    description: "Extractor de jugo compacto de 350ml, perfecto para preparar jugos frescos y naturales. Fácil de usar y limpiar.",
    category: "Electrodomésticos Pequeños"
  },
  {
    id: 301,
    name: "Hervidor de Agua Metálico Eléctrico RAF",
    price: 7990,
    images: [
      "/images/electro hogar/hervidores/hervidordeaguametalicoelectricoraf/5Lr+Yh6t80Rfc8TmqjHDXg==.jpg",
      "/images/electro hogar/hervidores/hervidordeaguametalicoelectricoraf/xyFIgoDEBEORooyqeCTEiA==.jpg"
    ],
    image: "/images/electro hogar/hervidores/hervidordeaguametalicoelectricoraf/5Lr+Yh6t80Rfc8TmqjHDXg==.jpg",
    description: "Hervidor de agua eléctrico RAF con acabado metálico. Rápido y eficiente para hervir agua en minutos.",
    category: "Electrodomésticos Pequeños"
  },
  {
    id: 302,
    name: "Termo Hervidor 2L",
    price: 14990,
    images: [
      "/images/electro hogar/hervidores/termohervidor2L/00MIpYOs5BSvmVmXF+JRuw==.jpg",
      "/images/electro hogar/hervidores/termohervidor2L/IzhJxuAZoiGkEleKAa0qew==.jpg",
      "/images/electro hogar/hervidores/termohervidor2L/rIYB7CntT1mfMJFk+SYX6g==.jpg"
    ],
    image: "/images/electro hogar/hervidores/termohervidor2L/00MIpYOs5BSvmVmXF+JRuw==.jpg",
    description: "Termo hervidor de 2 litros con función de mantener temperatura. Ideal para oficinas y hogares.",
    category: "Electrodomésticos Pequeños"
  },
  {
    id: 303,
    name: "Horno Eléctrico RAF 7L",
    price: 24990,
    images: [
      "/images/electro hogar/horno electrico/hornoelectricoraf7L/D_NQ_NP_2X_971078-MLC87849661423_072025-F.webp",
      "/images/electro hogar/horno electrico/hornoelectricoraf7L/D_NQ_NP_2X_982630-MLC87518821218_072025-F.webp"
    ],
    image: "/images/electro hogar/horno electrico/hornoelectricoraf7L/D_NQ_NP_2X_971078-MLC87849661423_072025-F.webp",
    description: "Horno eléctrico RAF de 7 litros, compacto y versátil. Perfecto para cocinar, hornear y tostar.",
    category: "Cocina"
  },
  {
    id: 304,
    name: "Plancha Parrilla con Sartén Eléctrica",
    price: 19990,
    images: [
      "/images/electro hogar/parrilas electricas/panchaparrillaconsartenelectrica/FbpKnFVX2tiKnhqVDvPPmg==.jpg",
      "/images/electro hogar/parrilas electricas/panchaparrillaconsartenelectrica/PWoLBJ48my71vTclmyinDQ==.jpg",
      "/images/electro hogar/parrilas electricas/panchaparrillaconsartenelectrica/Z24OY8Ti0PImNgKfGwep7w==.jpg"
    ],
    image: "/images/electro hogar/parrilas electricas/panchaparrillaconsartenelectrica/FbpKnFVX2tiKnhqVDvPPmg==.jpg",
    description: "Plancha parrilla multifuncional con sartén eléctrica. Ideal para asar carnes, vegetales y cocinar de manera saludable.",
    category: "Parrillas"
  },
  {
    id: 305,
    name: "Parrilla Eléctrica de Mesa",
    price: 14990,
    images: [
      "/images/electro hogar/parrilas electricas/parrillaelectricademesa/FuoQHKOCFoXtLtn8WXsw==.jpg"
    ],
    image: "/images/electro hogar/parrilas electricas/parrillaelectricademesa/FuoQHKOCFoXtLtn8WXsw==.jpg",
    description: "Parrilla eléctrica compacta de mesa, perfecta para barbacoas en interiores. Fácil de usar y limpiar.",
    category: "Parrillas"
  },
  {
    id: 306,
    name: "Parrilla Plancha Multifuncional",
    price: 39990,
    images: [
      "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/0hLdrUTGvPCzgKQUzZQ5ew==.jpg",
      "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/5gUTiEhUyCmIMNruV026xQ==.jpg",
      "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/GQoDuaRymprFkCAj5Ux3zQ==.jpg",
      "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/JueaKaOyG3UwL3XAsXxRnQ==.jpg",
      "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/yIDgk6edH90q4xi75dQD9A==.jpg"
    ],
    image: "/images/electro hogar/parrilas electricas/parrillaplanchamultifuncional/0hLdrUTGvPCzgKQUzZQ5ew==.jpg",
    description: "Parrilla plancha multifuncional con superficie antiadherente. Ideal para asar, planchar y cocinar múltiples alimentos.",
    category: "Parrillas"
  },
  {
    id: 307,
    name: "Procesador de Alimentos 3 Litros",
    price: 12990,
    images: [
      "/images/electro hogar/procesadora/procesadordealimentos3litros/byi5DQHhJ08sNN+3K2xSUQ==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentos3litros/lW6pQfbaN8jaxzK4WcOhrg==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentos3litros/zfCx9NqWRYT8gJUS9vUwQg==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentos3litros/ZsKqtUzY1aa23CcOGVVR5w==.jpg"
    ],
    image: "/images/electro hogar/procesadora/procesadordealimentos3litros/byi5DQHhJ08sNN+3K2xSUQ==.jpg",
    description: "Procesador de alimentos de 3 litros con múltiples funciones. Ideal para picar, mezclar, rallar y procesar todo tipo de ingredientes.",
    category: "Procesadoras"
  },
  {
    id: 308,
    name: "Procesador de Alimentos Eléctrico 5 Litros",
    price: 19990,
    images: [
      "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/eC9cIKdY1LGo3P4dduo6w==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/Isx5FCU5UBAclUJlPTeyvQ==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/MB99VNujBGLYlnxxrBjlA==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/Pqzw6ggGB8phx2M55PUfQ==.jpg",
      "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/y5niAenMWx2ZxpogtI2smw==.jpg"
    ],
    image: "/images/electro hogar/procesadora/procesadordealimentoselectrico5litros/eC9cIKdY1LGo3P4dduo6w==.jpg",
    description: "Procesador de alimentos eléctrico de gran capacidad (5 litros). Potente motor para procesar grandes cantidades de alimentos fácilmente.",
    category: "Procesadoras"
  },
  {
    id: 309,
    name: "Procesador Eléctrico de Alimentos 2L",
    price: 14990,
    images: [
      "/images/electro hogar/procesadora/procesadorelectricodealimentos2L/3nEmsxh7xXg5iVNVTWBFg==.jpg",
      "/images/electro hogar/procesadora/procesadorelectricodealimentos2L/8tuTa4ZLqjlKLayHlzUTg==.jpg",
      "/images/electro hogar/procesadora/procesadorelectricodealimentos2L/8UAZnq65Y8IPy+mGiO96Q==.jpg",
      "/images/electro hogar/procesadora/procesadorelectricodealimentos2L/uQ1Vo5bOctFrLGkcSfxGHg==.jpg"
    ],
    image: "/images/electro hogar/procesadora/procesadorelectricodealimentos2L/3nEmsxh7xXg5iVNVTWBFg==.jpg",
    description: "Procesador de alimentos de 2 litros con 4 cuchillas de acero inoxidable de doble palanca para triturar con mayor precisión. Equipado con almohadillas antideslizantes, bol apto para lavavajillas y dispositivo de protección térmica. Potencia: 1000W. Todas las piezas son desmontables y fáciles de manejar.",
    category: "Procesadoras"
  }
];

export default function ElectroHogarPage() {
  const { addToCart } = useCart();
  const { applyFilters } = useFilters();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Aplicar filtros a los productos de electro hogar
  const filteredElectroProducts = applyFilters(ELECTRO_HOGAR_PRODUCTS);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--background)' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #2c4a43 0%, #1a2f2a 100%)',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              marginBottom: '16px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⚡ Electro Hogar
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Electrodomésticos esenciales para tu cocina. Hervidores, extractores, hornos, parrillas, procesadoras y más para facilitar tu día a día.
            </p>
            <div style={{
              marginTop: '24px',
              fontSize: '1rem',
              opacity: 0.8

            }}>
              📦 {filteredElectroProducts.length} productos disponibles
            </div>
          </div>
        </section>

        <div className="container" style={{ padding: '40px 20px' }}>
          {/* Barra de herramientas */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: 'var(--text-primary)',
                margin: 0 
              }}>
                Electrodomésticos de Cocina
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                margin: '4px 0 0 0',
                fontSize: '0.9rem'
              }}>
                Hervidores, extractores, hornos, parrillas, procesadoras y más
              </p>
            </div>

            {/* Botón de filtros */}
            <div>
              <button
                onClick={toggleFilter}
                style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
                Filtros
              </button>
            </div>
          </div>

          {/* Grid de productos minimalista */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {filteredElectroProducts.map((product) => (
              <div key={product.id} style={{ position: 'relative' }}>
                {/* Botón de wishlist flotante */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <WishlistButton product={product} size="small" />
                </div>

                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  onClick={() => handleViewDetails(product)}
                />
              </div>
            ))}
          </div>

          {/* Panel de filtros */}
          <FilterPanel
            products={ELECTRO_HOGAR_PRODUCTS}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </main>

      {/* Modal de producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}