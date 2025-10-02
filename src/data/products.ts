/**
 * Base de datos centralizada de productos - IZA & CAS
 * 
 * Este archivo contiene todos los productos organizados por categorías.
 * Cualquier cambio aquí se reflejará automáticamente en toda la aplicación.
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  image: string; // Imagen principal (siempre será la primera del array)
  description: string;
  category: string;
}

// ===== PRODUCTOS DE HOGAR =====
const HOGAR_PRODUCTS_DATA = [
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
    description: "Cafetera italiana compacta para 6 tazas, Una buena Cafetera compatible con cocina de gas Y vitrocerámica",
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
    price: 19990,
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
    price: 32990,
    images: [
      "/images/hogar/ropa%20de%20cama/cobertorcon%20diseño2plazas/eOTcYbvYGAQe3udS+ja5w==.jpg"
    ],
    description: "Cobertor cálido y cómodo con diseño elegante para 2 plazas",
    category: "Ropa de Cama"
  },
  {
    id: 8,
    name: "Cobertor Chiporro Diseño 2 Plazas",
    price: 35990,
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
    name: "Alfombra Peluda 150",
    price: 18990,
    images: [
      "/images/hogar/alfomfrapeluda150/4KZJGt6taJMn9B33bK2dmw==.jpg",
      "/images/hogar/alfomfrapeluda150/jL0a1PHT+Z3y4HvRgayXNg==.jpg",
      "/images/hogar/alfomfrapeluda150/KFV6aotZwYU21WY5OBn0+A==.jpg"
    ],
    description: "Alfombra peluda de 150cm, suave y cómoda para cualquier habitación",
    category: "Alfombras"
  }
];

// Convertir datos a productos completos con imagen principal
export const HOGAR_PRODUCTS: Product[] = HOGAR_PRODUCTS_DATA.map(product => ({
  ...product,
  image: product.images[0] // La primera imagen es la principal
}));

// ===== PRODUCTOS DESTACADOS =====
// Selección curada de productos para mostrar en la página principal
export const FEATURED_PRODUCTS: Product[] = [
  // === HOGAR (2 productos) ===
  HOGAR_PRODUCTS.find(p => p.id === 1)!, // Cafetera Italiana 9 Tazas
  HOGAR_PRODUCTS.find(p => p.id === 3)!, // Hornilla Ocean
  
  // === ACTIVIDAD (2 productos) ===
  {
    id: 101,
    name: "Binoculares 30x60 Prismáticos",
    price: 9990,
    image: "/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg",
    images: ["/images/actividad/camping/binocular30X60prismaticos/DeD5uvaTWXye0rT0XomGqQ==.jpg"],
    description: "Binoculares profesionales con zoom 30x60 para observación de naturaleza",
    category: "Actividad"
  },
  {
    id: 102,
    name: "Hamaca 200x100cm",
    price: 7990,
    image: "/images/actividad/camping/hamaca200X100cm/5x5ySvyXdMCgMnncDNboA==.jpg",
    images: ["/images/actividad/camping/hamaca200X100cm/5x5ySvyXdMCgMnncDNboA==.jpg"],
    description: "Hamaca resistente y cómoda para relajarse al aire libre",
    category: "Actividad"
  },
  
  // === TECNOLOGÍA (2 productos) ===
  {
    id: 201,
    name: "Audífonos Inalámbricos IRM",
    price: 24990,
    image: "/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg",
    images: ["/images/tecnologia/audifonos/audifonosinalambricosirm/jXmOW83qKBBaXHrhzcq7Zw==.jpg"],
    description: "Audífonos inalámbricos con cancelación de ruido y excelente calidad",
    category: "Tecnología"
  },
  {
    id: 202,
    name: "Cámara de Seguridad 360° Ampolleta",
    price: 19990,
    image: "/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/cEFBWiCJt9NR7ruJKFX4Jg==.jpg",
    images: ["/images/tecnologia/camaras/camaradeseguridad360°tipoampolleta/cEFBWiCJt9NR7ruJKFX4Jg==.jpg"],
    description: "Cámara de seguridad WiFi tipo ampolleta con visión 360°",
    category: "Tecnología"
  },
  
  // === HERRAMIENTAS (2 productos) ===
  {
    id: 301,
    name: "Foco Solar 260W",
    price: 21990,
    image: "/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg",
    images: ["/images/herramientas/iluminacion/focosolar260w/AzFQZIjc2Lb0Axc+sCfFw==.jpg"],
    description: "Foco solar de alta potencia con panel integrado para exteriores",
    category: "Herramientas"
  },
  {
    id: 302,
    name: "Compresor de Aire Portátil",
    price: 14990,
    image: "/images/herramientas/car/compresordeaireportatil/RKfbUuFMQRacYZV3K6QmBg==.jpg",
    images: ["/images/herramientas/car/compresordeaireportatil/RKfbUuFMQRacYZV3K6QmBg==.jpg"],
    description: "Compresor portátil para inflar neumáticos y objetos inflables",
    category: "Herramientas"
  },
  
  // === JUGUETES (2 productos) ===
  {
    id: 401,
    name: "Carpa de Castillo Infantil",
    price: 12990,
    image: "/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg",
    images: ["/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg"],
    description: "Carpa de juegos para niños con diseño de castillo medieval",
    category: "Juguetes"
  },
  {
    id: 402,
    name: "Balón de Fútbol Air Power",
    price: 6990,
    image: "/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg",
    images: ["/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg"],
    description: "Balón de fútbol flotante con tecnología Air Power para jugar en casa",
    category: "Juguetes"
  },
  
  // === CUIDADO PERSONAL (2 productos) ===
  {
    id: 501,
    name: "Máquina de Afeitar Multifuncional",
    price: 15990,
    image: "/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarmultifuncional/b3o3V8FSay3NQ9Bua8tQSw==.jpg",
    images: ["/images/cuidadopersonal/maquinaafeitar/maquinadeafeitarmultifuncional/b3o3V8FSay3NQ9Bua8tQSw==.jpg"],
    description: "Máquina de afeitar eléctrica con múltiples accesorios",
    category: "Cuidado Personal"
  },
  {
    id: 502,
    name: "Humidificador Ultrasónico",
    price: 8990,
    image: "/images/cuidadopersonal/relajación/humidificadorultrasonico/Ww7p4bkBPNVbM5qFuglzOg==.jpg",
    images: ["/images/cuidadopersonal/relajación/humidificadorultrasonico/Ww7p4bkBPNVbM5qFuglzOg==.jpg"],
    description: "Humidificador con aromaterapia para crear ambiente relajante",
    category: "Cuidado Personal"
  }
];

// ===== UTILIDADES =====
export function getProductById(id: number): Product | undefined {
  return HOGAR_PRODUCTS.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return HOGAR_PRODUCTS.filter(product => product.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
}