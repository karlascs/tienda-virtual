'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useCart } from "@/context/CartContext";

// Datos de productos de herramientas (mismo que en la página principal)
const HERRAMIENTAS_PRODUCTS = [
  // === CATEGORÍA AUTOMOTRIZ ===
  {
    id: 1,
    name: "Cables Auxiliares para Auto",
    price: 7990,
    images: ["/images/herramientas/car/cableAuxiliares/0WNyc+Si42f13LcBw7Uw8A==.jpg"],
    image: "/images/herramientas/car/cableAuxiliares/0WNyc+Si42f13LcBw7Uw8A==.jpg",
    description: "Cables auxiliares de alta calidad para arranque de vehículos",
    category: "Automotriz",
    specifications: {
      "Material": "Cobre y PVC",
      "Longitud": "3 metros",
      "Capacidad": "500A",
      "Temperatura": "-40°C a 80°C",
      "Garantía": "1 año"
    }
  },
  {
    id: 2,
    name: "Compresor de Aire Portátil",
    price: 16990,
    images: ["/images/herramientas/car/compresordeaireportatil/6uxYH0xUbI5Ia7hYcbirA==.jpg"],
    image: "/images/herramientas/car/compresordeaireportatil/6uxYH0xUbI5Ia7hYcbirA==.jpg",
    description: "Compresor portátil para inflar neumáticos y equipos deportivos",
    category: "Automotriz",
    specifications: {
      "Presión máxima": "150 PSI",
      "Voltaje": "12V DC",
      "Cable": "3 metros",
      "Peso": "1.2 kg",
      "Garantía": "6 meses"
    }
  },
  {
    id: 3,
    name: "Espejo Retrovisor con Cámara",
    price: 17990,
    images: ["/images/herramientas/car/espejoretrovisorcon camara/Puvs6DbFSFmAOHTx3srljQ==.jpg"],
    image: "/images/herramientas/car/espejoretrovisorcon camara/Puvs6DbFSFmAOHTx3srljQ==.jpg",
    description: "Espejo retrovisor inteligente con cámara de seguridad integrada",
    category: "Automotriz",
    specifications: {
      "Pantalla": "7 pulgadas Full HD",
      "Cámara": "1080p con visión nocturna",
      "Grabación": "Loop recording",
      "Memoria": "Soporta hasta 32GB",
      "Garantía": "1 año"
    }
  },
  {
    id: 4,
    name: "Tabla Volante Multifuncional",
    price: 10990,
    images: ["/images/herramientas/car/tabavolante/Iovi68LXRxpNSbZYaP1J1Q==.jpg"],
    image: "/images/herramientas/car/tabavolante/Iovi68LXRxpNSbZYaP1J1Q==.jpg",
    description: "Tabla para volante ajustable, ideal para comer o trabajar en el auto",
    category: "Automotriz",
    specifications: {
      "Material": "ABS resistente",
      "Dimensiones": "42 x 28 cm",
      "Peso": "800g",
      "Ajustable": "Para volantes de 36-42cm",
      "Incluye": "Soporte para laptop y vaso"
    }
  },
  // === CATEGORÍA ILUMINACIÓN ===
  {
    id: 5,
    name: "Foco LED AC 200W",
    price: 12990,
    images: ["/images/herramientas/iluminacion/focoledacorriente200w/2TSThogXVzL0xN9w3e4OQ==.jpg"],
    image: "/images/herramientas/iluminacion/focoledacorriente200w/2TSThogXVzL0xN9w3e4OQ==.jpg",
    description: "Foco LED de alta potencia para iluminación exterior",
    category: "Iluminación",
    specifications: {
      "Potencia": "200W",
      "Voltaje": "220V AC",
      "Lumens": "20,000 lm",
      "Temperatura color": "6500K blanco frío",
      "Grado protección": "IP66",
      "Vida útil": "50,000 horas"
    }
  },
  {
    id: 6,
    name: "Foco LED AC 100W",
    price: 9990,
    images: ["/images/herramientas/iluminacion/focoledcorriente100w/9C9rrsRtNG1kyKwEQAQmMg==.jpg"],
    image: "/images/herramientas/iluminacion/focoledcorriente100w/9C9rrsRtNG1kyKwEQAQmMg==.jpg",
    description: "Foco LED eficiente para uso doméstico e industrial",
    category: "Iluminación",
    specifications: {
      "Potencia": "100W",
      "Voltaje": "220V AC",
      "Lumens": "10,000 lm",
      "Temperatura color": "6500K",
      "Grado protección": "IP65",
      "Vida útil": "50,000 horas"
    }
  },
  {
    id: 7,
    name: "Foco Solar 260W",
    price: 21990,
    images: ["/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg"],
    image: "/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg",
    description: "Foco solar de alta potencia con panel integrado",
    category: "Iluminación",
    specifications: {
      "Potencia LED": "260W",
      "Panel solar": "30W monocristalino",
      "Batería": "Litio 15,000mAh",
      "Autonomía": "8-12 horas",
      "Control": "Remoto incluido",
      "Sensor": "Movimiento PIR"
    }
  },
  {
    id: 8,
    name: "Foco Solar 50W con Panel",
    price: 14990,
    images: ["/images/herramientas/iluminacion/focosolar50wconpanel/8mEb4UzQDQa8dXrQStOKA==.jpg"],
    image: "/images/herramientas/iluminacion/focosolar50wconpanel/8mEb4UzQDQa8dXrQStOKA==.jpg",
    description: "Foco solar con panel separado y control remoto",
    category: "Iluminación",
    specifications: {
      "Potencia LED": "50W",
      "Panel solar": "18W",
      "Batería": "Litio 8,000mAh",
      "Cable panel": "5 metros",
      "Modos": "3 niveles de brillo",
      "Instalación": "Fácil montaje"
    }
  },
  {
    id: 9,
    name: "Foco Solar con Panel 100W",
    price: 9990,
    images: ["/images/herramientas/iluminacion/focosolarconpanel100w/6kohZNLgUWtytLE0OMoILw==.jpg"],
    image: "/images/herramientas/iluminacion/focosolarconpanel100w/6kohZNLgUWtytLE0OMoILw==.jpg",
    description: "Sistema de iluminación solar profesional 100W",
    category: "Iluminación",
    specifications: {
      "Potencia LED": "100W",
      "Panel solar": "25W",
      "Batería": "Litio 10,000mAh",
      "Lumens": "8,000 lm",
      "Autonomía": "6-10 horas",
      "Resistencia": "IP65"
    }
  },
  {
    id: 10,
    name: "Foco Solar con Sensor",
    price: 9990,
    images: ["/images/herramientas/iluminacion/focosolarconsensor/1RSAVCIjArog3zLC1C4w==.jpg"],
    image: "/images/herramientas/iluminacion/focosolarconsensor/1RSAVCIjArog3zLC1C4w==.jpg",
    description: "Foco solar automático con sensor de movimiento",
    category: "Iluminación",
    specifications: {
      "Potencia": "60W",
      "Sensor PIR": "6-8 metros",
      "Batería": "Litio 5,000mAh",
      "Modos": "Auto/Sensor/Siempre encendido",
      "Panel": "Integrado 15W",
      "Ángulo": "120° detección"
    }
  },
  {
    id: 11,
    name: "Foco Solar 50W",
    price: 7990,
    images: ["/images/herramientas/iluminacion/focosolarr50w/+JYijteB0oPddgFJiP43jw==.jpg"],
    image: "/images/herramientas/iluminacion/focosolarr50w/+JYijteB0oPddgFJiP43jw==.jpg",
    description: "Foco solar económico para jardines y patios",
    category: "Iluminación",
    specifications: {
      "Potencia": "50W",
      "Panel solar": "12W integrado",
      "Batería": "Litio 4,000mAh",
      "Tiempo carga": "6-8 horas sol",
      "Autonomía": "8-10 horas",
      "Protección": "IP65"
    }
  },
  {
    id: 12,
    name: "Foco Solar Triple",
    price: 14990,
    images: ["/images/herramientas/iluminacion/focosolartriple/A1fBJ9jMYFkHu9fHm6Uvrw==.jpg"],
    image: "/images/herramientas/iluminacion/focosolartriple/A1fBJ9jMYFkHu9fHm6Uvrw==.jpg",
    description: "Sistema de iluminación solar con tres focos direccionales",
    category: "Iluminación",
    specifications: {
      "Focos": "3 x 30W ajustables",
      "Panel": "Integrado 20W",
      "Batería": "Litio 8,000mAh",
      "Cobertura": "360° ajustable",
      "Control": "Remoto incluido",
      "Sensor": "Movimiento y crepuscular"
    }
  },
  {
    id: 13,
    name: "Foco Solar Triple Panel Separado",
    price: 14990,
    images: ["/images/herramientas/iluminacion/focosolartriplepanelseparado/PXkDMxA8s9Cl5nYRxyl9Yw==.jpg"],
    image: "/images/herramientas/iluminacion/focosolartriplepanelseparado/PXkDMxA8s9Cl5nYRxyl9Yw==.jpg",
    description: "Sistema triple con panel solar independiente",
    category: "Iluminación",
    specifications: {
      "Focos": "3 x 25W",
      "Panel": "Separado 18W",
      "Cable": "5 metros",
      "Batería": "Litio 6,000mAh",
      "Instalación": "Flexible",
      "Modos": "4 modos de iluminación"
    }
  },
  {
    id: 14,
    name: "Lámpara Bola de Cristal 8cm",
    price: 5990,
    images: ["/images/herramientas/iluminacion/lamparaboladecristalconfigura8cm/Xz7t1T5zVyae8EQYL+IOjQ==.jpg"],
    image: "/images/herramientas/iluminacion/lamparaboladecristalconfigura8cm/Xz7t1T5zVyae8EQYL+IOjQ==.jpg",
    description: "Lámpara decorativa de cristal configurable con colores",
    category: "Iluminación",
    specifications: {
      "Tamaño": "8cm diámetro",
      "Material": "Cristal templado",
      "LED": "RGB 16 colores",
      "Control": "Táctil y remoto",
      "Batería": "Recargable USB",
      "Autonomía": "6-8 horas"
    }
  },
  {
    id: 15,
    name: "Lámpara de Escritorio LED",
    price: 9990,
    images: ["/images/herramientas/iluminacion/lamparadeescritorio/+37x1lodfAFSpQlc0NdfHQ==.jpg"],
    image: "/images/herramientas/iluminacion/lamparadeescritorio/+37x1lodfAFSpQlc0NdfHQ==.jpg",
    description: "Lámpara LED ajustable para escritorio y estudio",
    category: "Iluminación",
    specifications: {
      "Potencia": "12W LED",
      "Temperatura": "3000K-6500K ajustable",
      "Dimmer": "10 niveles de brillo",
      "USB": "Puerto de carga incluido",
      "Brazo": "Articulado 360°",
      "Base": "Antideslizante estable"
    }
  },
  {
    id: 16,
    name: "Lámpara Espanta Cucos Proyector",
    price: 4990,
    images: ["/images/herramientas/iluminacion/lamparaespantacucosproyectorestrellas/5o0rbEbKIKC9e1fl8ilEWA==.jpg"],
    image: "/images/herramientas/iluminacion/lamparaespantacucosproyectorestrellas/5o0rbEbKIKC9e1fl8ilEWA==.jpg",
    description: "Lámpara proyector de estrellas con función espanta insectos",
    category: "Iluminación",
    specifications: {
      "Proyección": "Estrellas y galaxias",
      "Colores": "7 colores LED",
      "Temporizador": "1-2-3 horas",
      "Rotación": "360° automática",
      "Alimentación": "USB o 4 pilas AA",
      "Control": "Remoto incluido"
    }
  },
  {
    id: 17,
    name: "Linterna Parlante Bluetooth",
    price: 9990,
    images: ["/images/herramientas/iluminacion/linternaparlante/CnLlWchpCm1Cwn+7DXo4Ag==.jpg"],
    image: "/images/herramientas/iluminacion/linternaparlante/CnLlWchpCm1Cwn+7DXo4Ag==.jpg",
    description: "Linterna LED con parlante Bluetooth integrado",
    category: "Iluminación",
    specifications: {
      "LED": "5W alta potencia",
      "Bluetooth": "5.0",
      "Batería": "2,000mAh recargable",
      "Radio": "FM integrada",
      "Impermeabilidad": "IPX4",
      "Funciones": "Luz + música + power bank"
    }
  },
  {
    id: 18,
    name: "Linterna Solar LED Recargable",
    price: 9990,
    images: ["/images/herramientas/iluminacion/linternasolarledrecargableusb/+3quwlIYcA3ZN683T4klSw==.jpg"],
    image: "/images/herramientas/iluminacion/linternasolarledrecargableusb/+3quwlIYcA3ZN683T4klSw==.jpg",
    description: "Linterna solar con carga USB y múltiples modos",
    category: "Iluminación",
    specifications: {
      "LED": "10W CREE",
      "Panel solar": "2W",
      "Batería": "3,000mAh",
      "Carga": "Solar + USB",
      "Modos": "5 modos iluminación",
      "Zoom": "Enfoque ajustable"
    }
  },
  {
    id: 19,
    name: "Linterna LED SWAT Recargable",
    price: 9990,
    images: ["/images/herramientas/iluminacion/liternaledswatrecargable/E0hJPQE7ZsUyrFX6syjPA==.jpg"],
    image: "/images/herramientas/iluminacion/liternaledswatrecargable/E0hJPQE7ZsUyrFX6syjPA==.jpg",
    description: "Linterna táctica LED de alta potencia recargable",
    category: "Iluminación",
    specifications: {
      "LED": "15W CREE XML-T6",
      "Lumens": "2,000 lm",
      "Batería": "18650 recargable",
      "Modos": "5 modos + estroboscópico",
      "Material": "Aluminio aeronáutico",
      "Resistencia": "Impactos y agua IPX6"
    }
  },
  {
    id: 20,
    name: "Panel de Luz 36x25cm con Trípode",
    price: 22990,
    images: ["/images/herramientas/iluminacion/paneldeluz36X25cmtripodecontrol/F6Pu0H12fsWLK4O7MribQ==.jpg"],
    image: "/images/herramientas/iluminacion/paneldeluz36X25cmtripodecontrol/F6Pu0H12fsWLK4O7MribQ==.jpg",
    description: "Panel LED profesional con trípode y control remoto",
    category: "Iluminación",
    specifications: {
      "Dimensiones": "36 x 25 cm",
      "LEDs": "480 LEDs",
      "Temperatura": "3200K-5600K",
      "Dimmer": "0-100%",
      "Trípode": "Hasta 2 metros",
      "Alimentación": "Batería + AC adapter"
    }
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(params.id as string);
  const product = HERRAMIENTAS_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Producto no encontrado</h1>
          <button 
            onClick={() => router.back()}
            style={{
              background: 'var(--brand)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Volver
          </button>
        </main>
      </>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          
          {/* Botón volver */}
          <AnimatedSection animation="fade-in-up" threshold={0.3}>
            <button 
              onClick={() => router.back()}
              style={{
                background: 'transparent',
                border: '2px solid var(--brand)',
                color: 'var(--brand)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '30px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              ← Volver a Herramientas
            </button>
          </AnimatedSection>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px'
          }}>
            
            {/* Galería de imágenes */}
            <AnimatedSection animation="fade-in-left" threshold={0.3}>
              <div>
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '40px',
                  marginBottom: '20px',
                  position: 'relative',
                  aspectRatio: '1/1',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={product.images[currentImageIndex] || product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                
                {/* Thumbnails si hay múltiples imágenes */}
                {product.images && product.images.length > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '60px',
                          height: '60px',
                          border: `2px solid ${index === currentImageIndex ? 'var(--brand)' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: '#f8fafc',
                          padding: '4px'
                        }}
                      >
                        <img 
                          src={image}
                          alt={`${product.name} - vista ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Información del producto */}
            <AnimatedSection animation="fade-in-right" threshold={0.3}>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--brand)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {product.category}
                  </span>
                </div>
                
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>
                  {product.name}
                </h1>
                
                <p style={{
                  fontSize: '18px',
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  {product.description}
                </p>
                
                <div style={{ 
                  fontSize: '36px',
                  fontWeight: '700',
                  color: 'var(--brand)',
                  marginBottom: '32px'
                }}>
                  ${product.price.toLocaleString('es-CL')}
                </div>

                {/* Especificaciones */}
                {product.specifications && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '16px'
                    }}>
                      Especificaciones Técnicas
                    </h3>
                    <div style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {key}:
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Controles de cantidad y compra */}
                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      Cantidad:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '2px solid var(--brand)',
                          background: 'white',
                          color: 'var(--brand)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600'
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '2px solid var(--brand)',
                          background: 'white',
                          color: 'var(--brand)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 20px rgba(45, 74, 74, 0.3)'
                    }}
                  >
                    🛒 Añadir {quantity > 1 ? `${quantity} productos` : 'al carrito'} - ${(product.price * quantity).toLocaleString('es-CL')}
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
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

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </>
  );
}