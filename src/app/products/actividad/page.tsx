'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "@/styles/actividad.module.css";
import buttonStyles from "@/styles/productButtons.module.css";

/**
 * Productos de Actividad - IZA & CAS
 * 
 * Categoría dedicada a deportes, fitness y actividades al aire libre
 * Incluye: camping, piscina, playa, deportes
 * Con productos reales y funcionalidad completa de carrito
 */

// Datos reales de productos de actividad con imágenes subidas
const ACTIVIDAD_PRODUCTS = [
  // === CATEGORÍA CAMPING ===
  {
    id: 1,
    name: "Binoculares 30x60 Prismáticos",
    price: 24990,
    image: "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
    description: "Binoculares profesionales con zoom 30x60 para observación de naturaleza y camping",
    category: "Camping"
  },
  {
    id: 2,
    name: "Colchón Inflable 1 Plaza",
    price: 19990,
    image: "/images/actividad/camping/colchonesinfables1plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg",
    description: "Colchón inflable cómodo para una persona, ideal para camping y visitas",
    category: "Camping"
  },
  {
    id: 3,
    name: "Colchón Inflable 1.5 Plaza",
    price: 24990,
    image: "/images/actividad/camping/colchonesinflables1,5plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg",
    description: "Colchón inflable matrimonial pequeño con bomba incluida",
    category: "Camping"
  },
  {
    id: 4,
    name: "Hamaca 200x100cm",
    price: 16990,
    image: "/images/actividad/camping/hamaca200X100cm/oS0UutmGBbe6RtpE01TZIg==.jpg",
    description: "Hamaca resistente de algodón con soporte metálico incluido",
    category: "Camping"
  },
  {
    id: 5,
    name: "Hamaca 160x75cm",
    price: 12990,
    image: "/images/actividad/camping/hamacas160X75/NpiTu1pG23ClC8IctLuL1w==.jpg",
    description: "Hamaca compacta perfecta para espacios pequeños y viajes",
    category: "Camping"
  },
  {
    id: 6,
    name: "Lona Impermeable 4x6m",
    price: 29990,
    image: "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/EzYwQc9YP4gH4Pc9yTAxw==.jpg",
    description: "Lona resistente multiuso para camping, construcción y cobertura",
    category: "Camping"
  },
  {
    id: 7,
    name: "Lona Impermeable 3x6m",
    price: 24990,
    image: "/images/actividad/camping/lonasimpermeablesmultiuso3X6m/6VyN9lJAPymciSe8Pj9Nw==.jpg",
    description: "Lona impermeable versátil para múltiples usos exteriores",
    category: "Camping"
  },

  // === CATEGORÍA DEPORTES ===
  {
    id: 8,
    name: "Chaleco Deportivo para Correr",
    price: 15990,
    image: "/images/actividad/deporte/chalecodeportivoparacorrer/9xJn0ARIT5KPc0gchC3lQA==.jpg",
    description: "Chaleco reflectante con bolsillos para running y deportes nocturnos",
    category: "Deportes"
  },
  {
    id: 9,
    name: "Pesas de Arena para Tobillo 1kg",
    price: 8990,
    image: "/images/actividad/deporte/pesasdearenaparaeltobillo1k/VWeCfgHBrOgrSLBkIWrXtQ==.jpg",
    description: "Par de pesas ajustables de arena para ejercicios de resistencia",
    category: "Deportes"
  },

  // === CATEGORÍA PISCINA ===
  {
    id: 10,
    name: "Alfombra de Agua para Niños",
    price: 16990,
    image: "/images/actividad/piscina/alfombradeaguaparaniños/N0QIqZ4K15BUiAVms9EDzg==.jpg",
    description: "Alfombra de agua inflable con juegos para diversión infantil",
    category: "Piscina"
  },
  {
    id: 11,
    name: "Deslizador Acuático Tobogán",
    price: 39990,
    image: "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/O3TUgztVA++oKZ01NNTNw==.jpg",
    description: "Tobogán de agua con alfombra deslizante para jardín y piscina",
    category: "Piscina"
  },
  {
    id: 12,
    name: "Piscina Inflable 2.62x1.75x0.51m",
    price: 49990,
    image: "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/T8cBbYSZF1U42lTgTom4zA==.jpg",
    description: "Piscina inflable familiar con bomba incluida, ideal para patios",
    category: "Piscina"
  },

  // === CATEGORÍA PLAYA ===
  {
    id: 13,
    name: "Balde para Playa",
    price: 7990,
    image: "/images/actividad/playa/baldeparaplaya/KSCZvvoTVpazMv6ZLbiJUA==.jpg",
    description: "Set de balde con accesorios para juegos de arena en la playa",
    category: "Playa"
  },
  {
    id: 14,
    name: "Carpa para Playa",
    price: 34990,
    image: "/images/actividad/playa/carpaparaplaya/3uZc2I9d15iuH9fW81ybiw==.jpg",
    description: "Carpa pop-up resistente al viento con protección UV50+",
    category: "Playa"
  },
  {
    id: 15,
    name: "Quitasol",
    price: 18990,
    image: "/images/actividad/playa/quitasol/RJtwHp8l2Sx+5rn1SV7eiA==.jpg",
    description: "Sombrilla de playa ajustable con base resistente al viento",
    category: "Playa"
  }
];

export default function ActividadPage() {
  // Hooks para animaciones y funcionalidad
  const { containerRef: campingRef, visibleItems: campingVisible } = useScrollAnimationList(7, 0.2);
  const { containerRef: deportesRef, visibleItems: deportesVisible } = useScrollAnimationList(2, 0.2);
  const { containerRef: piscinaRef, visibleItems: piscinaVisible } = useScrollAnimationList(3, 0.2);
  const { containerRef: playaRef, visibleItems: playaVisible } = useScrollAnimationList(3, 0.2);
  
  // Hooks para funcionalidad del carrito
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Organizar productos por categorías
  const campingProducts = ACTIVIDAD_PRODUCTS.filter(p => p.category === "Camping");
  const deportesProducts = ACTIVIDAD_PRODUCTS.filter(p => p.category === "Deportes");
  const piscinaProducts = ACTIVIDAD_PRODUCTS.filter(p => p.category === "Piscina");
  const playaProducts = ACTIVIDAD_PRODUCTS.filter(p => p.category === "Playa");

  const renderProductGrid = (
    products: typeof ACTIVIDAD_PRODUCTS, 
    visibleItems: boolean[]
  ) => (
    <div className={styles.productsGrid}>
      {products.map((product, index) => {
        return (
          <div 
            key={product.id} 
            data-index={index}
            className={`${styles.productCard} fade-in-up fade-in-delay-${Math.min((index % 6) + 1, 6)} ${visibleItems[index] ? 'visible' : ''}`}
          >
            <div className={styles.imageContainer}>
              <img 
                src={product.image} 
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>
                {product.name}
              </h3>
              <p className={styles.productDescription}>
                {product.description}
              </p>
              <div className={styles.price}>
                ${product.price.toLocaleString('es-CL')}
              </div>
              <div className={buttonStyles.productActions}>
                <button 
                  className={buttonStyles.addToCartBtn}
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    images: [product.image],
                    image: product.image,
                    description: product.description,
                    category: 'Actividad'
                  })}
                >
                  🛒 Añadir al carrito
                </button>
                <button 
                  className={buttonStyles.viewDetailsBtn}
                  onClick={() => router.push(`/products/actividad/${product.id}`)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      <Header />
      
      <main>
        <div className="container">
          {/* Título de la categoría con animación */}
          <AnimatedSection 
            animation="fade-in-up"
            threshold={0.3}
          >
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
                🏃‍♂️ Actividad & Deportes
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '18px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Productos para camping, deportes, piscina y playa. Todo lo que necesitas para tus aventuras y actividades al aire libre
              </p>
            </div>
          </AnimatedSection>

          {/* Sección Camping */}
          <AnimatedSection animation="fade-in-up" threshold={0.3}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏕️ Camping & Outdoor
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Equipamiento esencial para acampar y actividades al aire libre
              </p>
              <div ref={campingRef as React.RefObject<HTMLDivElement>}>
                {renderProductGrid(campingProducts, campingVisible)}
              </div>
            </div>
          </AnimatedSection>

          {/* Sección Deportes */}
          <AnimatedSection animation="fade-in-up" threshold={0.3}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏃‍♂️ Deportes & Fitness
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Accesorios deportivos para mantenerte en forma y activo
              </p>
              <div ref={deportesRef as React.RefObject<HTMLDivElement>}>
                {renderProductGrid(deportesProducts, deportesVisible)}
              </div>
            </div>
          </AnimatedSection>

          {/* Sección Piscina */}
          <AnimatedSection animation="fade-in-up" threshold={0.3}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏊‍♀️ Piscina & Agua
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Diversión acuática para toda la familia en casa
              </p>
              <div ref={piscinaRef as React.RefObject<HTMLDivElement>}>
                {renderProductGrid(piscinaProducts, piscinaVisible)}
              </div>
            </div>
          </AnimatedSection>

          {/* Sección Playa */}
          <AnimatedSection animation="fade-in-up" threshold={0.3}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏖️ Playa & Verano
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Accesorios esenciales para disfrutar del sol y la playa
              </p>
              <div ref={playaRef as React.RefObject<HTMLDivElement>}>
                {renderProductGrid(playaProducts, playaVisible)}
              </div>
            </div>
          </AnimatedSection>
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
    </>
  );
}