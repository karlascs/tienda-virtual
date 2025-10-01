'use client';

import { useState } from "react";
import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";
import ProductCarousel from "@/components/ProductCarousel";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { HOGAR_PRODUCTS, Product } from "@/data/products";
import styles from '@/styles/hogar.module.css';

/**
 * Productos de Hogar - IZA & CAS
 * 
 * Categoría dedicada a electrodomésticos y artículos para el hogar
 * Incluye: electrodomésticos de cocina, limpieza, organización
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de hogar organizados por subcategorías (productos reales con múltiples imágenes)
const HOGAR_PRODUCTS = [
  // Cocina
  {
    id: 1,
    name: "Cafetera Italiana 9 Tazas",
    price: 10990,
    images: [
      "/images/hogar/cocina/cafeteraitaliana9tazas/fA5AYrYGix6Fl2oaWG4tHw==.jpg",
      "/images/hogar/cocina/cafeteraitaliana9tazas/L8vPxzxMHG45Tw0DSEzYbw==.jpg",
      "/images/hogar/cocina/cafeteraitaliana9tazas/Url9AggQ2RUXSM6L+mNN6A==.jpg"
    ],
description: "CAFETERA ITALIANA ACERO INOXIDABLE 9 TAZAS - Altura 21 cm - Una buena Cafetera compatible con cocina de gas Y vitrocerámica",
    category: "Cocina"
  },
  {
    id: 2,
    name: "Cafetera Italiana 6 Tazas",
    price: 8990,
    images: [
      "/images/hogar/cocina/cafeteraitaniana6tazas/fA5AYrYGix6Fl2oaWG4tHw==.jpg",
      "/images/hogar/cocina/cafeteraitaniana6tazas/L8vPxzxMHG45Tw0DSEzYbw==.jpg",
      "/images/hogar/cocina/cafeteraitaniana6tazas/Url9AggQ2RUXSM6L+mNN6A==.jpg"
    ],
    description: "Cafetera italiana compacta para 6 tazas,Una buena Cafetera compatible con cocina de gas Y vitrocerámica ",
    category: "Cocina"
  },
  {
    id: 3,
    name: "Hornilla Ocean",
    price: 17990,
    images: [
      "/images/hogar/cocina/hornillaocean/P4rjWBQsMl73GRNnxUh2Ew==.jpg",
      "/images/hogar/cocina/hornillaocean/QiNyx3mbvjGb9HLZKXidVw==.jpg",
      "/images/hogar/cocina/hornillaocean/yAZPXBZFdza8VjGWUnc7g==.jpg"
    ],
    description: "Hornilla eléctrica Ocean, diseño moderno y eficiente",
    category: "Cocina"
  },
  {
    id: 4,
    name: "Hornilla Reververo 1F",
    price: 8990,
    images: [
      "/images/hogar/cocina/hornillareververo1f/iFzUunFvXricQUiwdNsIAw==.jpg",
      "/images/hogar/cocina/hornillareververo1f/PTwIVR2n6z+wyEBWAfifA==.jpg"
    ],
    description: "Hornilla de una fuente, perfecta para espacios pequeños",
    category: "Cocina"
  },
  // Electrodomésticos
  {
    id: 5,
    name: "Batidora RAF MIXER",
    price: 14990,
    images: [
      "/images/hogar/electrodomesticos/batidoraRAFMIXER/10525000019001_2.jpg",
      "/images/hogar/electrodomesticos/batidoraRAFMIXER/10525000019001_3.jpg",
      "/images/hogar/electrodomesticos/batidoraRAFMIXER/10525000019001_5.jpg"
    ],
    description: "Batidora de alta potencia RAF MIXER, múltiples velocidades",
    category: "Electrodomésticos"
  },
  {
    id: 6,
    name: "Moledor de Café",
    price: 8990,
    images: [
      "/images/hogar/electrodomesticos/moledordecafe/3hK66QjJNRmgin0L1sVhQ==.jpg",
      "/images/hogar/electrodomesticos/moledordecafe/gF3ZFgRvL+YStUknLgsPg==.jpg",
      "/images/hogar/electrodomesticos/moledordecafe/n014hLQ4IIyGNXDbsIN34g==.jpg"
    ],
    description: "Moledor de café eléctrico, granos frescos siempre",
    category: "Electrodomésticos"
  },
  // Ropa de Cama
  {
    id: 7,
    name: "Cobertor con Diseño 2 Plazas",
    price: 21990,
    images: [
      "/images/hogar/ropa%20de%20cama/cobertorcon%20diseño2plazas/eOTcYbvYGAQe3udS+ja5w==.jpg"
    ],
    description: "Cobertor cálido y cómodo con diseño elegante para 2 plazas",
    category: "Ropa de Cama"
  },
  {
    id: 8,
    name: "Cobertor Chiporro Diseño 2 Plazas",
    price: 19990,
    images: [
      "/images/hogar/ropa%20de%20cama/cobertorconchiporrodiseño2plazas/F9A6a7rv5tUCGeR462eDQ==.jpg",
      "/images/hogar/ropa%20de%20cama/cobertorconchiporrodiseño2plazas/JfKu7Z2pqcy1ESm+8oN34A==.jpg",
      "/images/hogar/ropa%20de%20cama/cobertorconchiporrodiseño2plazas/QvTNEIFZi1qhZsLUSjbKZA==.jpg",
      "/images/hogar/ropa%20de%20cama/cobertorconchiporrodiseño2plazas/TSnisvJ0D8Rr2aAAtvA3mA==.jpg"
    ],
    description: "Cobertor con diseño chiporro, suave y abrigador",
    category: "Ropa de Cama"
  },
  // Alfombras
  {
    id: 9,
    name: "Alfombra Peluda 150cm",
    price: 14990,
    images: [
      "/images/hogar/alfomfrapeluda150/4KZJGt6taJMn9B33bK2dmw==.jpg",
      "/images/hogar/alfomfrapeluda150/jL0a1PHT+Z3y4HvRgayXNg==.jpg",
      "/images/hogar/alfomfrapeluda150/KFV6aotZwYU21WY5OBn0+A==.jpg"
    ],
    description: "Alfombra peluda de 150cm, textura suave y acogedora",
    category: "Alfombras"
  }
];

// Función para agrupar productos por categoría
const groupProductsByCategory = (products: typeof HOGAR_PRODUCTS) => {
  return products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof HOGAR_PRODUCTS>);
};

// Emojis para cada categoría
const categoryEmojis: Record<string, string> = {
  "Cocina": "🍳",
  "Electrodomésticos": "⚡",
  "Ropa de Cama": "🛏️",
  "Alfombras": "🟫"
};

export default function HogarPage() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productsByCategory = groupProductsByCategory(HOGAR_PRODUCTS);

  // Función para convertir producto a formato del carrito
  const convertToCartProduct = (product: typeof HOGAR_PRODUCTS[0]): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0], // Usar la primera imagen
    description: product.description,
    category: product.category
  });

  // Función para manejar "Ver detalles"
  const handleViewDetails = (product: typeof HOGAR_PRODUCTS[0]) => {
    setSelectedProduct(convertToCartProduct(product));
    setIsModalOpen(true);
  };

  // Función para manejar "Añadir al carrito"
  const handleAddToCart = (product: typeof HOGAR_PRODUCTS[0]) => {
    addToCart(convertToCartProduct(product));
  };

  // Función para manejar "Añadir al carrito" desde el modal
  const handleAddToCartFromModal = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      <Header />
      
      <main className={styles.hogarMain}>
        {/* Overlay con efectos */}
        <div className={styles.hogarOverlay} />
        
        <div className={styles.hogarContainer}>
          {/* Título de la categoría */}
          <div className={styles.categoryTitle}>
            <h1 className={styles.title}>
              🏠 Productos para el Hogar
            </h1>
            <p className={styles.subtitle}>
              Descubre nuestras subcategorías: Cocina, Electrodomésticos, Ropa de Cama y Alfombras
            </p>
          </div>

          {/* Productos organizados por subcategorías */}
          {Object.entries(productsByCategory).map(([categoryName, products]) => (
            <div key={categoryName} className={styles.subcategorySection}>
              {/* Título de subcategoría */}
              <h2 className={styles.subcategoryTitle}>
                {categoryEmojis[categoryName]} {categoryName}
                <span className={styles.productCount}>
                  ({products.length} productos)
                </span>
              </h2>

              {/* Grid de productos de la subcategoría */}
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <ProductCarousel 
                      images={product.images}
                      productName={product.name}
                      className={styles.imageContainer}
                    />
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>
                        {product.name}
                      </h3>
                      
                      <p className={styles.productDescription}>
                        {product.description}
                      </p>

                      <div className={styles.productFooter}>
                        <div className={styles.price}>
                          ${product.price.toLocaleString('es-CL')}
                        </div>
                        
                        <span className={styles.categoryTag}>
                          {product.category}
                        </span>
                      </div>

                      <div className={styles.productActions}>
                        <button 
                          className={styles.addToCartBtn}
                          onClick={() => handleAddToCart(product)}
                        >
                          🛒 Añadir al Carrito
                        </button>
                        <button 
                          className={styles.viewDetailsBtn}
                          onClick={() => handleViewDetails(product)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <AnimatedFooter 
        animation="fade-in-up"
        threshold={0.8}
        className="container"
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 IZA & CAS — hecho por karla cuevas
      </AnimatedFooter>

      {/* Modal de detalles del producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCartFromModal}
      />
    </>
  );
}