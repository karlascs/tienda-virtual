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
  // Obtener productos específicos por ID de diferentes categorías
  HOGAR_PRODUCTS.find(p => p.id === 1)!, // Cafetera Italiana 9 Tazas
  HOGAR_PRODUCTS.find(p => p.id === 5)!, // Batidora RAF MIXER
  HOGAR_PRODUCTS.find(p => p.id === 3)!, // Hornilla Ocean
  HOGAR_PRODUCTS.find(p => p.id === 6)!, // Moledor de Café
  HOGAR_PRODUCTS.find(p => p.id === 2)!, // Cafetera Italiana 6 Tazas
  HOGAR_PRODUCTS.find(p => p.id === 4)!, // Hornilla Reververo 1F
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