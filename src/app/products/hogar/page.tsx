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

// Función para agrupar productos por categoría
function groupProductsByCategory(products: Product[]) {
  return products.reduce((groups, product) => {
    const category = product.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {} as Record<string, Product[]>);
}

// Iconos para las categorías
const categoryIcons: Record<string, string> = {
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

  // Función para manejar "Ver detalles"
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Función para manejar "Añadir al carrito"
  const handleAddToCart = (product: Product) => {
    addToCart(product);
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
              Encuentra todo lo que necesitas para tu hogar: electrodomésticos, 
              artículos de cocina, ropa de cama y más
            </p>
          </div>

          {/* Productos organizados por categoría */}
          {Object.entries(productsByCategory).map(([category, products]) => (
            <AnimatedSection 
              key={category}
              animation="fade-in-up"
              threshold={0.3}
              className={styles.categorySection}
            >
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryName}>
                  {categoryIcons[category]} {category}
                </h2>
                <div className={styles.categoryLine}></div>
              </div>
              
              {/* Grid de productos */}
              <div className={styles.productsGrid}>
                {products.map((product, index) => (
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
                      <div className={styles.productPrice}>
                        ${product.price.toLocaleString('es-CL')}
                      </div>
                      <div className={styles.productActions}>
                        <button 
                          className={styles.detailsBtn}
                          onClick={() => handleViewDetails(product)}
                        >
                          Ver detalles
                        </button>
                        <button 
                          className={styles.addToCartBtn}
                          onClick={() => handleAddToCart(product)}
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </main>

      {/* Modal para ver detalles del producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCartFromModal}
      />

      {/* Footer */}
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
    </>
  );
}