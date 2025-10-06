'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/context/CartContext";
import { HOGAR_PRODUCTS, Product } from "@/data/products";

export default function HogarPage() {
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
              🏠 Productos para el Hogar
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Todo lo que necesitas para hacer tu hogar más cómodo y funcional
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {HOGAR_PRODUCTS.map((product) => (
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