'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedFooter from "@/components/AnimatedFooter";
import { useCart } from "@/context/CartContext";

// Datos completos de productos de actividad con especificaciones
const ACTIVIDAD_PRODUCTS = [
  // === CATEGORÍA CAMPING ===
  {
    id: 1,
    name: "Binoculares 30x60 Prismáticos",
    price: 24990,
    images: ["/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg"],
    image: "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
    description: "Binoculares profesionales con zoom 30x60 para observación de naturaleza y camping",
    category: "Camping",
    specifications: {
      "Magnificación": "30x60",
      "Lente objetivo": "60mm",
      "Campo visual": "126m/1000m",
      "Material": "Metal y cristal óptico",
      "Peso": "550g",
      "Incluye": "Estuche y correa"
    }
  },
  {
    id: 2,
    name: "Colchón Inflable 1 Plaza",
    price: 19990,
    images: ["/images/actividad/camping/colchonesinfables1plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg"],
    image: "/images/actividad/camping/colchonesinfables1plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg",
    description: "Colchón inflable cómodo para una persona, ideal para camping y visitas",
    category: "Camping",
    specifications: {
      "Dimensiones": "190 x 70 x 20 cm",
      "Material": "PVC resistente",
      "Peso": "1.8 kg",
      "Capacidad": "120 kg máximo",
      "Tiempo inflado": "3-5 minutos",
      "Incluye": "Bomba manual y kit reparación"
    }
  },
  {
    id: 3,
    name: "Colchón Inflable 1.5 Plaza",
    price: 24990,
    images: ["/images/actividad/camping/colchonesinflables1,5plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg"],
    image: "/images/actividad/camping/colchonesinflables1,5plaza/1X4DW7Z+smvyexJBBR5I2w==.jpg",
    description: "Colchón inflable matrimonial pequeño con bomba incluida",
    category: "Camping",
    specifications: {
      "Dimensiones": "190 x 120 x 22 cm",
      "Material": "PVC reforzado",
      "Peso": "2.5 kg",
      "Capacidad": "180 kg máximo",
      "Bomba": "Eléctrica 12V incluida",
      "Superficie": "Aterciopelada antideslizante"
    }
  },
  {
    id: 4,
    name: "Hamaca 200x100cm",
    price: 16990,
    images: ["/images/actividad/camping/hamaca200X100cm/oS0UutmGBbe6RtpE01TZIg==.jpg"],
    image: "/images/actividad/camping/hamaca200X100cm/oS0UutmGBbe6RtpE01TZIg==.jpg",
    description: "Hamaca resistente de algodón con soporte metálico incluido",
    category: "Camping",
    specifications: {
      "Dimensiones": "200 x 100 cm",
      "Material": "Algodón 100%",
      "Soporte": "Acero galvanizado",
      "Peso máximo": "120 kg",
      "Peso total": "3.2 kg",
      "Instalación": "Sin nudos, fácil montaje"
    }
  },
  {
    id: 5,
    name: "Hamaca 160x75cm",
    price: 12990,
    images: ["/images/actividad/camping/hamacas160X75/NpiTu1pG23ClC8IctLuL1w==.jpg"],
    image: "/images/actividad/camping/hamacas160X75/NpiTu1pG23ClC8IctLuL1w==.jpg",
    description: "Hamaca compacta perfecta para espacios pequeños y viajes",
    category: "Camping",
    specifications: {
      "Dimensiones": "160 x 75 cm",
      "Material": "Poliéster resistente",
      "Peso": "800g",
      "Capacidad": "100 kg",
      "Plegado": "Ultracompacta",
      "Accesorios": "Cuerdas y mosquetones incluidos"
    }
  },
  {
    id: 6,
    name: "Lona Impermeable 4x6m",
    price: 29990,
    images: ["/images/actividad/camping/lonaimpermeablesmultiuso4X6m/EzYwQc9YP4gH4Pc9yTAxw==.jpg"],
    image: "/images/actividad/camping/lonaimpermeablesmultiuso4X6m/EzYwQc9YP4gH4Pc9yTAxw==.jpg",
    description: "Lona resistente multiuso para camping, construcción y cobertura",
    category: "Camping",
    specifications: {
      "Dimensiones": "4 x 6 metros",
      "Material": "PE laminado 140g/m²",
      "Impermeabilidad": "100% resistente al agua",
      "Ojales": "Reforzados cada 50cm",
      "UV": "Protección anti-UV",
      "Usos": "Camping, construcción, jardín"
    }
  },
  {
    id: 7,
    name: "Lona Impermeable 3x6m",
    price: 24990,
    images: ["/images/actividad/camping/lonasimpermeablesmultiuso3X6m/6VyN9lJAPymciSe8Pj9Nw==.jpg"],
    image: "/images/actividad/camping/lonasimpermeablesmultiuso3X6m/6VyN9lJAPymciSe8Pj9Nw==.jpg",
    description: "Lona impermeable versátil para múltiples usos exteriores",
    category: "Camping",
    specifications: {
      "Dimensiones": "3 x 6 metros",
      "Material": "PE reforzado 120g/m²",
      "Resistencia": "Viento y lluvia",
      "Temperatura": "-30°C a +80°C",
      "Ojales": "Metálicos cada metro",
      "Garantía": "2 años uso normal"
    }
  },

  // === CATEGORÍA DEPORTES ===
  {
    id: 8,
    name: "Chaleco Deportivo para Correr",
    price: 15990,
    images: ["/images/actividad/deporte/chalecodeportivoparacorrer/9xJn0ARIT5KPc0gchC3lQA==.jpg"],
    image: "/images/actividad/deporte/chalecodeportivoparacorrer/9xJn0ARIT5KPc0gchC3lQA==.jpg",
    description: "Chaleco reflectante con bolsillos para running y deportes nocturnos",
    category: "Deportes",
    specifications: {
      "Material": "Poliéster transpirable",
      "Bolsillos": "4 compartimentos",
      "Reflectantes": "Cintas 3M",
      "Tallas": "S, M, L, XL disponibles",
      "Ajustable": "Velcro lateral",
      "Lavado": "Máquina agua fría"
    }
  },
  {
    id: 9,
    name: "Pesas de Arena para Tobillo 1kg",
    price: 8990,
    images: ["/images/actividad/deporte/pesasdearenaparaeltobillo1k/VWeCfgHBrOgrSLBkIWrXtQ==.jpg"],
    image: "/images/actividad/deporte/pesasdearenaparaeltobillo1k/VWeCfgHBrOgrSLBkIWrXtQ==.jpg",
    description: "Par de pesas ajustables de arena para ejercicios de resistencia",
    category: "Deportes",
    specifications: {
      "Peso": "1kg cada una (par)",
      "Material": "Neopreno suave",
      "Relleno": "Arena fina lavada",
      "Ajuste": "Velcro de alta resistencia",
      "Medidas": "25cm x 12cm",
      "Uso": "Tobillo, muñeca, rehabilitación"
    }
  },

  // === CATEGORÍA PISCINA ===
  {
    id: 10,
    name: "Alfombra de Agua para Niños",
    price: 16990,
    images: ["/images/actividad/piscina/alfombradeaguaparaniños/N0QIqZ4K15BUiAVms9EDzg==.jpg"],
    image: "/images/actividad/piscina/alfombradeaguaparaniños/N0QIqZ4K15BUiAVms9EDzg==.jpg",
    description: "Alfombra de agua inflable con juegos para diversión infantil",
    category: "Piscina",
    specifications: {
      "Dimensiones": "170 x 100 cm",
      "Material": "PVC libre de BPA",
      "Edad": "3+ años",
      "Juegos": "Aspersores integrados",
      "Conexión": "Manguera estándar",
      "Fácil": "Plegable para guardar"
    }
  },
  {
    id: 11,
    name: "Deslizador Acuático Tobogán",
    price: 39990,
    images: ["/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/O3TUgztVA++oKZ01NNTNw==.jpg"],
    image: "/images/actividad/piscina/deslizaderoacuaticotoboganalfombra/O3TUgztVA++oKZ01NNTNw==.jpg",
    description: "Tobogán de agua con alfombra deslizante para jardín y piscina",
    category: "Piscina",
    specifications: {
      "Longitud": "5.5 metros",
      "Ancho": "75 cm",
      "Material": "PVC reforzado 0.3mm",
      "Chorros": "Múltiples aspersores",
      "Edad": "5+ años",
      "Peso máximo": "80 kg por uso"
    }
  },
  {
    id: 12,
    name: "Piscina Inflable 2.62x1.75x0.51m",
    price: 49990,
    images: ["/images/actividad/piscina/piscinainfable2,62X1,75X0,51/T8cBbYSZF1U42lTgTom4zA==.jpg"],
    image: "/images/actividad/piscina/piscinainfable2,62X1,75X0,51/T8cBbYSZF1U42lTgTom4zA==.jpg",
    description: "Piscina inflable familiar con bomba incluida, ideal para patios",
    category: "Piscina",
    specifications: {
      "Dimensiones": "2.62 x 1.75 x 0.51 m",
      "Capacidad": "778 litros",
      "Material": "PVC trilaminar",
      "Válvulas": "Doble seguridad",
      "Bomba": "Eléctrica incluida",
      "Drenaje": "Válvula de desagüe"
    }
  },

  // === CATEGORÍA PLAYA ===
  {
    id: 13,
    name: "Balde para Playa",
    price: 7990,
    images: ["/images/actividad/playa/baldeparaplaya/KSCZvvoTVpazMv6ZLbiJUA==.jpg"],
    image: "/images/actividad/playa/baldeparaplaya/KSCZvvoTVpazMv6ZLbiJUA==.jpg",
    description: "Set de balde con accesorios para juegos de arena en la playa",
    category: "Playa",
    specifications: {
      "Incluye": "Balde, pala, rastrillo, moldes",
      "Material": "Plástico resistente UV",
      "Capacidad": "2 litros",
      "Edad": "3+ años",
      "Colores": "Varios disponibles",
      "Fácil": "Transporte y limpieza"
    }
  },
  {
    id: 14,
    name: "Carpa para Playa",
    price: 34990,
    images: ["/images/actividad/playa/carpaparaplaya/3uZc2I9d15iuH9fW81ybiw==.jpg"],
    image: "/images/actividad/playa/carpaparaplaya/3uZc2I9d15iuH9fW81ybiw==.jpg",
    description: "Carpa pop-up resistente al viento con protección UV50+",
    category: "Playa",
    specifications: {
      "Dimensiones": "200 x 120 x 130 cm",
      "Capacidad": "2-3 personas",
      "Protección": "UV50+ certificado",
      "Material": "Poliéster 190T",
      "Montaje": "Pop-up automático",
      "Peso": "1.8 kg con bolsa"
    }
  },
  {
    id: 15,
    name: "Quitasol",
    price: 18990,
    images: ["/images/actividad/playa/quitasol/RJtwHp8l2Sx+5rn1SV7eiA==.jpg"],
    image: "/images/actividad/playa/quitasol/RJtwHp8l2Sx+5rn1SV7eiA==.jpg",
    description: "Sombrilla de playa ajustable con base resistente al viento",
    category: "Playa",
    specifications: {
      "Diámetro": "180 cm",
      "Altura": "180-210 cm ajustable",
      "Material": "Poliéster anti-UV",
      "Base": "Sistema de anclaje arena",
      "Inclinación": "Ajustable 45°",
      "Peso": "2.2 kg transportable"
    }
  }
];

export default function ActividadProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(params.id as string);
  const product = ACTIVIDAD_PRODUCTS.find(p => p.id === productId);

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
              ← Volver a Actividad
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
                      Especificaciones
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