'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

/**
 * Productos de Juguetes - IZA & CAS
 * 
 * Categoría dedicada a juguetes y entretenimiento infantil
 * Incluye: juguetes educativos, electrónicos, creativos
 * Con animaciones suaves y experiencia de usuario moderna
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

// Datos reales de productos de juguetes con imágenes subidas
const JUGUETES_PRODUCTS = [
  // === CATEGORÍA CARPAS ===
  {
    id: 1,
    name: "Carpa Casita de Princesa",
    price: 13990,
    image: "/images/juguetes/carpas/carpacasitadeprincesa/Lhhy21XKrkVC65vB32M2A==.jpg",
    images: ["/images/juguetes/carpas/carpacasitadeprincesa/Lhhy21XKrkVC65vB32M2A==.jpg"],
    description: "Carpa infantil rosa con diseño de castillo de princesa, perfecta para juegos imaginativos",
    category: "Carpas"
  },
  {
    id: 2,
    name: "Carpa de Castillo Infantil",
    price: 9990,
    image: "/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg",
    images: ["/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg"],
    description: "Carpa de castillo medieval con torres, ideal para aventuras imaginarias",
    category: "Carpas"
  },
  {
    id: 3,
    name: "Carpa Túnel",
    price: 15990,
    image: "/images/juguetes/carpas/carpatull/5akH6Dp3dL2d1M7an3cdw==.jpg",
    images: ["/images/juguetes/carpas/carpatull/5akH6Dp3dL2d1M7an3cdw==.jpg"],
    description: "Carpa túnel colorida para gatear y explorar, estimula el desarrollo motor",
    category: "Carpas"
  },
  {
    id: 4,
    name: "Carpa Túnel y Piscina",
    price: 14990,
    image: "/images/juguetes/carpas/carpatunelypiscina/2YkhYBannBV+S8VKicaftg==.jpg",
    images: ["/images/juguetes/carpas/carpatunelypiscina/2YkhYBannBV+S8VKicaftg==.jpg"],
    description: "Set completo con carpa túnel y piscina de pelotas incluida",
    category: "Carpas"
  },

  // === CATEGORÍA JUEGOS ===
  {
    id: 5,
    name: "Balón de Fútbol Air Power",
    price: 4990,
    image: "/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg",
    images: ["/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg"],
    description: "Balón de fútbol flotante con tecnología air power, se desliza suavemente sobre cualquier superficie",
    category: "Juegos"
  },
  {
    id: 6,
    name: "Juguete de Conejo",
    price: 10990,
    image: "/images/juguetes/juegos/juguetedeconejo/m69auj4HYrBap3VgOqbzFw==.jpg",
    images: ["/images/juguetes/juegos/juguetedeconejo/m69auj4HYrBap3VgOqbzFw==.jpg"],
    description: "Adorable juguete de conejo suave y seguro para niños pequeños",
    category: "Juegos"
  },
  {
    id: 7,
    name: "Peluche Squish Hello Kitty",
    price: 8990,
    image: "/images/juguetes/juegos/peluchesquishhellokitty/jFtEB61tRbk4m2yWiFcJ2g==.jpg",
    images: ["/images/juguetes/juegos/peluchesquishhellokitty/jFtEB61tRbk4m2yWiFcJ2g==.jpg"],
    description: "Peluche suave de Hello Kitty con textura squish, perfecto para abrazar",
    category: "Juegos"
  },
  {
    id: 8,
    name: "Proyector Astronauta Infantil",
    price: 14990,
    image: "/images/juguetes/juegos/proyectorastronautainfantil/Oi5EV9Yz0RwTxkXfdZOWA==.jpg",
    images: ["/images/juguetes/juegos/proyectorastronautainfantil/Oi5EV9Yz0RwTxkXfdZOWA==.jpg"],
    description: "Proyector LED con forma de astronauta, crea un ambiente mágico en la habitación",
    category: "Juegos"
  },
  {
    id: 9,
    name: "Set de Cocina Kitchen",
    price: 13990,
    image: "/images/juguetes/juegos/setdecocinakitchen/maS7T17udnInDSgyIwZkOg==.jpg",
    images: ["/images/juguetes/juegos/setdecocinakitchen/maS7T17udnInDSgyIwZkOg==.jpg"],
    description: "Set de cocina completo con utensilios, perfecto para juegos de rol",
    category: "Juegos"
  },
  {
    id: 10,
    name: "Set Tocador de Belleza para Niña",
    price: 12990,
    image: "/images/juguetes/juegos/settocadordebellezaparaniñadejuguete/GznbYQsPTThf9iOYkgQEeg==.jpg",
    images: ["/images/juguetes/juegos/settocadordebellezaparaniñadejuguete/GznbYQsPTThf9iOYkgQEeg==.jpg"],
    description: "Tocador de juguete con espejo y accesorios de belleza para niñas",
    category: "Juegos"
  },
  {
    id: 11,
    name: "Tabla de Skate Patineta",
    price: 13990,
    image: "/images/juguetes/juegos/tabladeskatepatineta/PlN2ht5vQi3OreVv4FI8+g==.jpg",
    images: ["/images/juguetes/juegos/tabladeskatepatineta/PlN2ht5vQi3OreVv4FI8+g==.jpg"],
    description: "Patineta profesional para niños y adolescentes, diseño moderno y resistente",
    category: "Juegos"
  },

  // === CATEGORÍA LIBRERÍA ===
  {
    id: 12,
    name: "Estuche Hello Kitty",
    price: 5000,
    image: "/images/juguetes/libreria/estuchehellokyte/18lRr4+0SYTdK1AUhA1aKg==.jpg",
    images: ["/images/juguetes/libreria/estuchehellokyte/18lRr4+0SYTdK1AUhA1aKg==.jpg"],
    description: "Estuche escolar de Hello Kitty con múltiples compartimentos",
    category: "Librería"
  },
  {
    id: 13,
    name: "Maleta de Colores de Madera 180 Piezas",
    price: 10990,
    image: "/images/juguetes/libreria/maletadecoloresdemaderade180piezas/6vjBTfK7WoSSZke7QJy7w==.jpg",
    images: ["/images/juguetes/libreria/maletadecoloresdemaderade180piezas/6vjBTfK7WoSSZke7QJy7w==.jpg"],
    description: "Set completo de arte con 180 piezas en maleta de madera, ideal para creatividad",
    category: "Librería"
  },
  {
    id: 14,
    name: "Maleta de Plumones 80 Piezas",
    price: 8990,
    image: "/images/juguetes/libreria/maletadeplumonesde80piezas/2xKvxI0PoB2FbTvN4+HPJA==.jpg",
    images: ["/images/juguetes/libreria/maletadeplumonesde80piezas/2xKvxI0PoB2FbTvN4+HPJA==.jpg"],
    description: "Set de 80 plumones y marcadores en maleta organizadora",
    category: "Librería"
  },
  {
    id: 15,
    name: "Mesa y Sillas Infantil",
    price: 29990,
    image: "/images/juguetes/libreria/mesaysillasinfantil/2NHTYN8GJnO9ChovZXBnGw==.jpg",
    images: ["/images/juguetes/libreria/mesaysillasinfantil/2NHTYN8GJnO9ChovZXBnGw==.jpg"],
    description: "Conjunto de mesa y sillas de madera para niños, ideal para estudiar y jugar",
    category: "Librería"
  }
];

export default function JuguetesPage() {
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
              🧸 Juguetes & Diversión
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Juguetes educativos y de entretenimiento para todas las edades
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid" style={{ marginBottom: '60px' }}>
            {JUGUETES_PRODUCTS.map((product) => (
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