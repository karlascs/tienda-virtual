'use client';

import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useScrollAnimationList } from "@/hooks/useScrollAnimation";

/**
 * Productos de Herramientas - IZA & CAS
 * 
 * Categoría dedicada a herramientas para el hogar y bricolaje
 * Incluye: herramientas eléctricas, manuales, accesorios
 * Con animaciones suaves y experiencia de usuario moderna
 */

// Datos de productos de herramientas (estáticos para MVP)
const HERRAMIENTAS_PRODUCTS = [
  // === CATEGORÍA AUTOMOTRIZ ===
  {
    id: 1,
    name: "Cables Auxiliares para Auto",
    price: 15990,
    image: "/images/herramientas/car/cableAuxiliares/0WNyc+Si42f13LcBw7Uw8A==.jpg",
    description: "Cables auxiliares de alta calidad para arranque de vehículos"
  },
  {
    id: 2,
    name: "Compresor de Aire Portátil",
    price: 45990,
    image: "/images/herramientas/car/compresordeaireportatil/6uxYH0xUbI5Ia7hYcbirA==.jpg",
    description: "Compresor portátil para inflar neumáticos y equipos deportivos"
  },
  {
    id: 3,
    name: "Espejo Retrovisor con Cámara",
    price: 89990,
    image: "/images/herramientas/car/espejoretrovisorcon camara/Puvs6DbFSFmAOHTx3srljQ==.jpg",
    description: "Espejo retrovisor inteligente con cámara de seguridad integrada"
  },
  {
    id: 4,
    name: "Tabla Volante Multifuncional",
    price: 32990,
    image: "/images/herramientas/car/tabavolante/Iovi68LXRxpNSbZYaP1J1Q==.jpg",
    description: "Tabla para volante ajustable, ideal para comer o trabajar en el auto"
  },
  
  // === CATEGORÍA ILUMINACIÓN ===
  {
    id: 5,
    name: "Foco LED AC 200W",
    price: 78990,
    image: "/images/herramientas/iluminacion/focoledacorriente200w/2TSThogXVzL0xN9w3e4OQ==.jpg",
    description: "Foco LED de alta potencia para iluminación exterior"
  },
  {
    id: 6,
    name: "Foco LED AC 100W",
    price: 58990,
    image: "/images/herramientas/iluminacion/focoledcorriente100w/9C9rrsRtNG1kyKwEQAQmMg==.jpg",
    description: "Foco LED eficiente para uso doméstico e industrial"
  },
  {
    id: 7,
    name: "Foco Solar 260W",
    price: 125990,
    image: "/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg",
    description: "Foco solar de alta potencia con panel integrado"
  },
  {
    id: 8,
    name: "Foco Solar 50W con Panel",
    price: 65990,
    image: "/images/herramientas/iluminacion/focosolar50wconpanel/8mEb4UzQDQa8dXrQStOKA==.jpg",
    description: "Foco solar con panel separado y control remoto"
  },
  {
    id: 9,
    name: "Foco Solar con Panel 100W",
    price: 89990,
    image: "/images/herramientas/iluminacion/focosolarconpanel100w/6kohZNLgUWtytLE0OMoILw==.jpg",
    description: "Sistema de iluminación solar profesional 100W"
  },
  {
    id: 10,
    name: "Foco Solar con Sensor",
    price: 45990,
    image: "/images/herramientas/iluminacion/focosolarconsensor/1RSAVCIjArog3zLC1C4w==.jpg",
    description: "Foco solar automático con sensor de movimiento"
  },
  {
    id: 11,
    name: "Foco Solar 50W",
    price: 39990,
    image: "/images/herramientas/iluminacion/focosolarr50w/+JYijteB0oPddgFJiP43jw==.jpg",
    description: "Foco solar económico para jardines y patios"
  },
  {
    id: 12,
    name: "Foco Solar Triple",
    price: 145990,
    image: "/images/herramientas/iluminacion/focosolartriple/A1fBJ9jMYFkHu9fHm6Uvrw==.jpg",
    description: "Sistema de iluminación solar con tres focos direccionales"
  },
  {
    id: 13,
    name: "Foco Solar Triple Panel Separado",
    price: 156990,
    image: "/images/herramientas/iluminacion/focosolartriplepanelseparado/PXkDMxA8s9Cl5nYRxyl9Yw==.jpg",
    description: "Sistema triple con panel solar independiente"
  },
  {
    id: 14,
    name: "Lámpara Bola de Cristal 8cm",
    price: 24990,
    image: "/images/herramientas/iluminacion/lamparaboladecristalconfigura8cm/Xz7t1T5zVyae8EQYL+IOjQ==.jpg",
    description: "Lámpara decorativa de cristal configurable con colores"
  },
  {
    id: 15,
    name: "Lámpara de Escritorio LED",
    price: 35990,
    image: "/images/herramientas/iluminacion/lamparadeescritorio/+37x1lodfAFSpQlc0NdfHQ==.jpg",
    description: "Lámpara LED ajustable para escritorio y estudio"
  },
  {
    id: 16,
    name: "Lámpara Espanta Cucos Proyector",
    price: 42990,
    image: "/images/herramientas/iluminacion/lamparaespantacucosproyectorestrellas/5o0rbEbKIKC9e1fl8ilEWA==.jpg",
    description: "Lámpara proyector de estrellas con función espanta insectos"
  },
  {
    id: 17,
    name: "Linterna Parlante Bluetooth",
    price: 28990,
    image: "/images/herramientas/iluminacion/linternaparlante/CnLlWchpCm1Cwn+7DXo4Ag==.jpg",
    description: "Linterna LED con parlante Bluetooth integrado"
  },
  {
    id: 18,
    name: "Linterna Solar LED Recargable",
    price: 19990,
    image: "/images/herramientas/iluminacion/linternasolarledrecargableusb/+3quwlIYcA3ZN683T4klSw==.jpg",
    description: "Linterna solar con carga USB y múltiples modos"
  },
  {
    id: 19,
    name: "Linterna LED SWAT Recargable",
    price: 22990,
    image: "/images/herramientas/iluminacion/liternaledswatrecargable/E0hJPQE7ZsUyrFX6syjPA==.jpg",
    description: "Linterna táctica LED de alta potencia recargable"
  },
  {
    id: 20,
    name: "Panel de Luz 36x25cm con Trípode",
    price: 85990,
    image: "/images/herramientas/iluminacion/paneldeluz36X25cmtripodecontrol/F6Pu0H12fsWLK4O7MribQ==.jpg",
    description: "Panel LED profesional con trípode y control remoto"
  }
];

export default function HerramientasPage() {
  const { containerRef, visibleItems } = useScrollAnimationList(HERRAMIENTAS_PRODUCTS.length, 0.2);
  
  // Organizar productos por categorías
  const automotrizProducts = HERRAMIENTAS_PRODUCTS.slice(0, 4);  // IDs 1-4
  const iluminacionProducts = HERRAMIENTAS_PRODUCTS.slice(4);    // IDs 5-20

  const renderProductGrid = (products: typeof HERRAMIENTAS_PRODUCTS, startIndex: number = 0) => (
    <div className="grid" style={{ marginBottom: '60px' }}>
      {products.map((product, index) => {
        const globalIndex = startIndex + index;
        return (
          <div 
            key={product.id} 
            data-index={globalIndex}
            className={`card fade-in-up fade-in-delay-${Math.min((index % 6) + 1, 6)} ${visibleItems[globalIndex] ? 'visible' : ''}`}
          >
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'contain',
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '8px 8px 0 0'
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
                  onClick={() => console.log('Añadir al carrito:', product.name)}
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
                  onClick={() => console.log('Ver detalles:', product.name)}
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
                🔧 Herramientas & Iluminación
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '18px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Herramientas automotrices, sistemas de iluminación LED y solar, accesorios profesionales para todos tus proyectos
              </p>
            </div>
          </AnimatedSection>

          {/* Sección Automotriz */}
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
                🚗 Accesorios Automotrices
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Herramientas y accesorios esenciales para tu vehículo
              </p>
              <div ref={containerRef as React.RefObject<HTMLDivElement>}>
                {renderProductGrid(automotrizProducts, 0)}
              </div>
            </div>
          </AnimatedSection>

          {/* Sección Iluminación */}
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
                💡 Sistemas de Iluminación
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                marginBottom: '30px'
              }}>
                Focos LED, solares y sistemas de iluminación profesional
              </p>
              {renderProductGrid(iluminacionProducts, 4)}
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