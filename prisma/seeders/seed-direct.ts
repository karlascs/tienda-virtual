/**
 * Seeder directo de productos IZA&CAS
 * Importa productos específicos de cada categoría
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de categorías
const CATEGORY_MAPPING: { [key: string]: string } = {
  'Carpas': 'juguetes',
  'Juegos': 'juguetes',
  'Librería': 'juguetes',
  'Audífonos': 'tecnologia',
  'Cámaras': 'tecnologia',
  'Celular': 'tecnologia',
  'Herramientas': 'herramientas',
  'Car': 'herramientas',
  'Iluminación': 'herramientas',
  'Camping': 'actividad',
  'Deporte': 'actividad',
  'Piscina': 'actividad',
  'Playa': 'actividad',
  'Cuidado Personal': 'cuidadopersonal',
  'Relajación': 'cuidadopersonal',
  'Electrodomésticos': 'electrohogar',
  'Cocina': 'hogar',
  'Ropa de Cama': 'hogar',
}

// Categorías principales
const CATEGORIES_DATA = [
  {
    name: 'Electro Hogar',
    slug: 'electrohogar',
    description: 'Electrodomésticos esenciales para la cocina moderna',
    image: '/images/categorias/electrohogar.png',
  },
  {
    name: 'Hogar',
    slug: 'hogar',
    description: 'Productos para el hogar, cocina y decoración',
    image: '/images/categorias/hogar.png',
  },
  {
    name: 'Herramientas',
    slug: 'herramientas',
    description: 'Herramientas profesionales para bricolaje y construcción',
    image: '/images/categorias/herramientas.png',
  },
  {
    name: 'Juguetes',
    slug: 'juguetes',
    description: 'Juguetes educativos y de entretenimiento',
    image: '/images/categorias/juguetes.png',
  },
  {
    name: 'Tecnología',
    slug: 'tecnologia',
    description: 'Dispositivos tecnológicos y accesorios',
    image: '/images/categorias/tecnologia.png',
  },
  {
    name: 'Actividad',
    slug: 'actividad',
    description: 'Equipos deportivos y actividades al aire libre',
    image: '/images/categorias/actividad.png',
  },
  {
    name: 'Cuidado Personal',
    slug: 'cuidadopersonal',
    description: 'Productos para el cuidado personal y belleza',
    image: '/images/categorias/cuidadopersonal.png',
  },
]

// Productos de Juguetes extraídos directamente
const JUGUETES_PRODUCTS = [
  {
    id: 1,
    name: "Carpa Casita de Princesa",
    price: 13990,
    image: "/images/juguetes/carpas/carpacasitadeprincesa/Lhhy21XKrkVC65vB32M2A==.jpg",
    images: [
      "/images/juguetes/carpas/carpacasitadeprincesa/Lhhy21XKrkVC65vB32M2A==.jpg",
      "/images/juguetes/carpas/carpacasitadeprincesa/u2iQ9YPR48hRApbF2jakHQ==.jpg",
      "/images/juguetes/carpas/carpacasitadeprincesa/ziYL69zCRtGjaok3ens60g==.jpg"
    ],
    description: "Carpa infantil rosa con diseño de castillo de princesa, perfecta para juegos imaginativos",
    category: "Carpas"
  },
  {
    id: 2,
    name: "Carpa de Castillo Infantil",
    price: 9990,
    image: "/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg",
    images: [
      "/images/juguetes/carpas/carpadecastilloinfantil/9OY2PNp1LAMvXlx0yBIceQ==.jpg",
      "/images/juguetes/carpas/carpadecastilloinfantil/FIn12o6i1gaPKuO+ir78GQ==.jpg",
      "/images/juguetes/carpas/carpadecastilloinfantil/hObt9WlKpFmp4gWUzD6WoA==.jpg",
      "/images/juguetes/carpas/carpadecastilloinfantil/RhKj87FQw798PyY33Yo5TQ==.jpg",
      "/images/juguetes/carpas/carpadecastilloinfantil/zAYeqC3ZEiSC3rfUjsGTjg==.jpg"
    ],
    description: "Carpa de castillo medieval con torres, ideal para aventuras imaginarias",
    category: "Carpas"
  },
  {
    id: 3,
    name: "Carpa Túnel",
    price: 15990,
    image: "/images/juguetes/carpas/carpatull/5akH6Dp3dL2d1M7an3cdw==.jpg",
    images: [
      "/images/juguetes/carpas/carpatull/5akH6Dp3dL2d1M7an3cdw==.jpg",
      "/images/juguetes/carpas/carpatull/lLTBj4tHvNc1IUlCYVSX7g==.jpg",
      "/images/juguetes/carpas/carpatull/tPNXM4NQv3ivQ9TFi9Gkg==.jpg"
    ],
    description: "Carpa túnel colorida para gatear y explorar, estimula el desarrollo motor",
    category: "Carpas"
  },
  {
    id: 4,
    name: "Carpa Túnel y Piscina",
    price: 14990,
    image: "/images/juguetes/carpas/carpatunelypiscina/2YkhYBannBV+S8VKicaftg==.jpg",
    images: [
      "/images/juguetes/carpas/carpatunelypiscina/2YkhYBannBV+S8VKicaftg==.jpg",
      "/images/juguetes/carpas/carpatunelypiscina/JeEFgPLwV7KuQP5rqeeCsQ==.jpg",
      "/images/juguetes/carpas/carpatunelypiscina/lj6ApDeY1ZaFhh+9LC5mlg==.jpg",
      "/images/juguetes/carpas/carpatunelypiscina/RvSaKd51opXMRN0DRDptvA==.jpg"
    ],
    description: "Set completo con carpa túnel y piscina de pelotas incluida",
    category: "Carpas"
  },
  {
    id: 5,
    name: "Balón de Fútbol Air Power",
    price: 4990,
    image: "/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg",
    images: [
      "/images/juguetes/juegos/balondefutbollairpower/CCCoe523QU66+hsy944EkA==.jpg",
      "/images/juguetes/juegos/balondefutbollairpower/La805Apadcwjxd4+iWZKvA==.jpg",
      "/images/juguetes/juegos/balondefutbollairpower/zZr2cEVFeQpyCfqcfa9L0A==.jpg"
    ],
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
    images: [
      "/images/juguetes/juegos/proyectorastronautainfantil/Oi5EV9Yz0RwTxkXfdZOWA==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/fQufiBJlm0IJsOKDxK97zg==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/PfFpTZvFgKektD7iuuMplQ==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/Q28HQiNBZDCb8srFs4OAVg==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/QQfeaw00fLT+mmK7gkSTw==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/rlhCuhe9xP+qzVZ43Uwow==.jpg",
      "/images/juguetes/juegos/proyectorastronautainfantil/s6fL7J38gM9KxzRYb32g==.jpg"
    ],
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
    images: [
      "/images/juguetes/juegos/settocadordebellezaparaniñadejuguete/GznbYQsPTThf9iOYkgQEeg==.jpg",
      "/images/juguetes/juegos/settocadordebellezaparaniñadejuguete/uv05jG6c3ujnU0h5qaDEg==.jpg"
    ],
    description: "Tocador de juguete con espejo y accesorios de belleza para niñas",
    category: "Juegos"
  },
  {
    id: 11,
    name: "Tabla de Skate Patineta",
    price: 13990,
    image: "/images/juguetes/juegos/tabladeskatepatineta/PlN2ht5vQi3OreVv4FI8+g==.jpg",
    images: [
      "/images/juguetes/juegos/tabladeskatepatineta/PlN2ht5vQi3OreVv4FI8+g==.jpg",
      "/images/juguetes/juegos/tabladeskatepatineta/g8cya8q+XUi0fSkvDVFEBg==.jpg"
    ],
    description: "Patineta profesional para niños y adolescentes, diseño moderno y resistente",
    category: "Juegos"
  },
  {
    id: 12,
    name: "Estuche Hello Kitty",
    price: 5000,
    image: "/images/juguetes/libreria/estuchehellokyte/18lRr4+0SYTdK1AUhA1aKg==.jpg",
    images: [
      "/images/juguetes/libreria/estuchehellokyte/18lRr4+0SYTdK1AUhA1aKg==.jpg",
      "/images/juguetes/libreria/estuchehellokyte/9h+wpLVnZR6M2pHXcpWcFg==.jpg",
      "/images/juguetes/libreria/estuchehellokyte/arykM3QdiH1fbw6fiyN18w==.jpg",
      "/images/juguetes/libreria/estuchehellokyte/efkaTx4U5IPdaaYBOVQACw==.jpg",
      "/images/juguetes/libreria/estuchehellokyte/Id7oN58ecAvcSg11JHAE0A==.jpg"
    ],
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
    images: [
      "/images/juguetes/libreria/maletadeplumonesde80piezas/2xKvxI0PoB2FbTvN4+HPJA==.jpg",
      "/images/juguetes/libreria/maletadeplumonesde80piezas/FrmlZskO43aFTgHJvLEWyQ==.jpg",
      "/images/juguetes/libreria/maletadeplumonesde80piezas/lhQsIHb6FdMN5rJ6CRScA==.jpg",
      "/images/juguetes/libreria/maletadeplumonesde80piezas/ZKfGt27D2RvafXAxMPUiiw==.jpg"
    ],
    description: "Set de 80 plumones y marcadores en maleta organizadora",
    category: "Librería"
  },
  {
    id: 15,
    name: "Mesa y Sillas Infantil",
    price: 29990,
    image: "/images/juguetes/libreria/mesaysillasinfantil/2NHTYN8GJnO9ChovZXBnGw==.jpg",
    images: [
      "/images/juguetes/libreria/mesaysillasinfantil/2NHTYN8GJnO9ChovZXBnGw==.jpg",
      "/images/juguetes/libreria/mesaysillasinfantil/61uiOuFtKOWZ0ortZ7Ro0A==.jpg",
      "/images/juguetes/libreria/mesaysillasinfantil/vw3W8hxNSGNgnuWsvCWJhg==.jpg",
      "/images/juguetes/libreria/mesaysillasinfantil/zqQKbyHwfDQi1Hmre8SqHQ==.jpg"
    ],
    description: "Conjunto de mesa y sillas de madera para niños, ideal para estudiar y jugar",
    category: "Librería"
  }
]

// Productos de Tecnología (extraído también)
const TECNOLOGIA_PRODUCTS = [
  {
    id: 101,
    name: "Audífonos Inalámbricos IRM",
    price: 7990,
    image: "/images/tecnologia/audifonos/audifonosinalambricosirm/1V+xAO0wR26d+kGCJwuCg==.jpg",
    images: [
      "/images/tecnologia/audifonos/audifonosinalambricosirm/1V+xAO0wR26d+kGCJwuCg==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/6hBUYEIB3cglgqyFUBKKGw==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/8hxw+9CMyPyGF2dcNlJ6YA==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/jGjG+EjM1J8vbK8Hq+l2UQ==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/O9cKGJdOhT1dcL1WoSCZKA==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/PeN5FQP1QpCPUGmGlQYWxw==.jpg",
      "/images/tecnologia/audifonos/audifonosinalambricosirm/Y6WG6FP2KwOrmfCvqEqCHQ==.jpg"
    ],
    description: "Audífonos Bluetooth con cancelación de ruido y carga inalámbrica",
    category: "Audífonos"
  },
  {
    id: 102,
    name: "Cámara de Seguridad 360° Tipo Ampolleta",
    price: 12990,
    image: "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/2lQJOqBYjGXvf4EGpq+M3A==.jpg",
    images: [
      "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/2lQJOqBYjGXvf4EGpq+M3A==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/8nrCLSIW8mttJNBVkfCBvQ==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/JJ2Mf8OjvdYElKuQJGm4cA==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/rqCQ5eSHcYo9YSC0zADVQw==.jpg",
      "/images/tecnologia/camaras/camaradeseguridad360tipoampolleta/X+AjP+bI3z1o6iC9BebZQ==.jpg"
    ],
    description: "Cámara inteligente con vista panorámica 360°, fácil instalación como ampolleta",
    category: "Cámaras"
  },
  {
    id: 103,
    name: "Cámara de Seguridad Exteriores 360° IP66",
    price: 15990,
    image: "/images/tecnologia/camaras/camaradeseguridadexteriores360ip66/CdUXG7ZznxfGcq4PcEPJw==.jpg",
    images: [
      "/images/tecnologia/camaras/camaradeseguridadexteriores360ip66/CdUXG7ZznxfGcq4PcEPJw==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360ip66/FFKZ6hbJPNPXMpNzMPGCAg==.jpg",
      "/images/tecnologia/camaras/camaradeseguridadexteriores360ip66/xKdvH8H2q8LdWDwK3rJHtQ==.jpg"
    ],
    description: "Cámara resistente al agua IP66 para exteriores con vista 360°",
    category: "Cámaras"
  },
  {
    id: 104,
    name: "Mini Cámara Espía HD",
    price: 9990,
    image: "/images/tecnologia/camaras/minicamaraespiahd/HBdtyVoIrk7G4Pj3nqVehw==.jpg",
    images: [
      "/images/tecnologia/camaras/minicamaraespiahd/HBdtyVoIrk7G4Pj3nqVehw==.jpg",
      "/images/tecnologia/camaras/minicamaraespiahd/mjnLJEhFLjmR6NiJAWHY+Q==.jpg",
      "/images/tecnologia/camaras/minicamaraespiahd/x+lhpKQSQMZdUJC1Wd27qA==.jpg"
    ],
    description: "Cámara compacta de alta definición para vigilancia discreta",
    category: "Cámaras"
  },
  {
    id: 105,
    name: "Cable USB Tipo C para Celular",
    price: 2990,
    image: "/images/tecnologia/celular/cableusbtipocparacelular/64u98SApZT9wCnhqNUKlw==.jpg",
    images: [
      "/images/tecnologia/celular/cableusbtipocparacelular/64u98SApZT9wCnhqNUKlw==.jpg",
      "/images/tecnologia/celular/cableusbtipocparacelular/B36xn+M89xI9jnItWnFyJA==.jpg",
      "/images/tecnologia/celular/cableusbtipocparacelular/Fd0vOGNzwvB16sYGNE3FkQ==.jpg",
      "/images/tecnologia/celular/cableusbtipocparacelular/JXQ2IZR8zdz1vOhqBpKF9Q==.jpg"
    ],
    description: "Cable de carga rápida USB-C de alta calidad y resistente",
    category: "Celular"
  },
  {
    id: 106,
    name: "Cargador Dual USB Tipo C",
    price: 4990,
    image: "/images/tecnologia/celular/cargadordualusbtipoc/FsxK9OqKuGl2eHq5W2j96w==.jpg",
    images: ["/images/tecnologia/celular/cargadordualusbtipoc/FsxK9OqKuGl2eHq5W2j96w==.jpg"],
    description: "Cargador de pared con doble puerto USB-C de carga rápida",
    category: "Celular"
  },
  {
    id: 107,
    name: "Cargador iPhone + Cable",
    price: 5990,
    image: "/images/tecnologia/celular/cargadoriphone+cable/b7i7PmkItOdJzJ3g6tJ==.jpg",
    images: ["/images/tecnologia/celular/cargadoriphone+cable/b7i7PmkItOdJzJ3g6tJ==.jpg"],
    description: "Cargador original para iPhone con cable Lightning incluido",
    category: "Celular"
  }
]

// Función para extraer características
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  // Patrones de características
  const patterns = [
    { regex: /(\d+)\s*tazas/i, template: (match: string) => `${match} tazas` },
    { regex: /(\d+)\s*plazas/i, template: (match: string) => `${match} plazas` },
    { regex: /(\d+)\s*ml/i, template: (match: string) => `${match}ml de capacidad` },
    { regex: /(\d+)\s*piezas/i, template: (match: string) => `Set de ${match} piezas` },
    { regex: /LED/i, template: () => 'Tecnología LED' },
    { regex: /USB/i, template: () => 'Conexión USB' },
    { regex: /Bluetooth/i, template: () => 'Bluetooth' },
    { regex: /inalámbric/i, template: () => 'Inalámbrico' },
    { regex: /resistente/i, template: () => 'Resistente' },
    { regex: /HD|alta definición/i, template: () => 'Alta definición' },
    { regex: /360/i, template: () => 'Vista 360°' },
    { regex: /IP66/i, template: () => 'Resistente al agua IP66' },
    { regex: /madera/i, template: () => 'Hecho de madera' },
    { regex: /infantil|niños|niñas/i, template: () => 'Para niños' },
  ]
  
  const text = `${name} ${description}`.toLowerCase()
  
  for (const pattern of patterns) {
    const match = text.match(pattern.regex)
    if (match) {
      const feature = pattern.template(match[1] || match[0])
      if (!features.includes(feature)) {
        features.push(feature)
      }
    }
  }
  
  return features.length > 0 ? features : ['Producto de calidad']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['IRM', 'Air Power', 'Hello Kitty', 'iPhone']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

// Función principal
async function main() {
  console.log('🌱 Iniciando migración directa de productos IZA&CAS...')

  try {
    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...')
    await prisma.productView.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.cartItem.deleteMany({})
    await prisma.wishlistItem.deleteMany({})
    await prisma.cart.deleteMany({})
    await prisma.wishlist.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.user.deleteMany({})

    // 2. Crear categorías
    console.log('📁 Creando categorías...')
    const categories = await Promise.all(
      CATEGORIES_DATA.map(async (categoryData) => {
        return await prisma.category.create({
          data: categoryData,
        })
      })
    )
    console.log(`✅ ${categories.length} categorías creadas`)

    // 3. Crear productos
    console.log('📦 Creando productos...')
    
    const allProducts = [...JUGUETES_PRODUCTS, ...TECNOLOGIA_PRODUCTS]
    let productCount = 0
    
    for (const product of allProducts) {
      const categorySlug = CATEGORY_MAPPING[product.category] || 'hogar'
      const category = categories.find(cat => cat.slug === categorySlug)
      
      if (!category) {
        console.warn(`⚠️  Categoría no encontrada para: ${product.category} -> ${categorySlug}`)
        continue
      }

      // Generar slug único
      const baseSlug = product.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      let slug = baseSlug
      let counter = 1
      
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Extraer características y marca
      const features = extractFeatures(product)
      const brand = extractBrand(product.name)

      // Validar imágenes
      const validImages = product.images?.filter((img: string) => img && img.trim() !== '') || []

      // Generar SKU único
      const existingCount = await prisma.product.count({
        where: { categoryId: category.id }
      })
      const categoryCode = category.slug.substring(0, 5).toUpperCase()
      const sku = `SKU-${categoryCode}-${String(existingCount + 1).padStart(3, '0')}`

      try {
        const createdProduct = await prisma.product.create({
          data: {
            name: product.name,
            slug,
            sku,
            description: product.description,
            price: product.price,
            brand,
            features,
            images: validImages,
            stock: Math.floor(Math.random() * 20) + 5,
            isFeatured: Math.random() > 0.85, // 15% productos destacados
            categoryId: category.id,
          },
        })

        productCount++
        console.log(`  ✅ ${productCount}. ${createdProduct.name} (${category.name})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`✅ ${productCount} productos migrados exitosamente`)

    // 4. Crear usuarios de ejemplo
    console.log('👥 Creando usuarios de ejemplo...')
    const users = [
      {
        email: 'admin@izacas.com',
        name: 'Administrador IZA&CAS',
        hashedPassword: '$2b$10$rQ8KqK9zYzQqYzQqYzQqYe',
        verified: true,
        address: 'Oficina Central IZA&CAS',
        city: 'Santiago',
        zipCode: '7500000',
      },
      {
        email: 'maria@example.com',
        name: 'María González',
        hashedPassword: '$2b$10$rQ8KqK9zYzQqYzQqYzQqYe',
        verified: true,
      },
      {
        email: 'juan@example.com',
        name: 'Juan Pérez',
        hashedPassword: '$2b$10$rQ8KqK9zYzQqYzQqYzQqYe',
        verified: true,
      },
    ]

    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        return await prisma.user.create({
          data: userData,
        })
      })
    )
    console.log(`✅ ${createdUsers.length} usuarios creados`)

    // 5. Crear reseñas de ejemplo
    console.log('⭐ Creando reseñas de ejemplo...')
    const products = await prisma.product.findMany({ take: 20 })
    const sampleReviews = [
      { rating: 5, title: 'Excelente producto', comment: 'Muy satisfecho con la compra, cumple todas las expectativas.' },
      { rating: 4, title: 'Muy bueno', comment: 'Buena calidad, aunque el precio podría ser mejor.' },
      { rating: 5, title: 'Recomendado', comment: 'Llegó rápido y en perfectas condiciones. Lo recomiendo.' },
      { rating: 4, title: 'Buena experiencia', comment: 'Funciona como se esperaba, buen servicio al cliente.' },
      { rating: 5, title: 'Perfecto', comment: 'Exactamente lo que necesitaba, calidad premium.' },
    ]

    let reviewCount = 0
    for (let i = 0; i < Math.min(products.length, 25); i++) {
      const product = products[i]
      const user = createdUsers[i % createdUsers.length]
      const reviewData = sampleReviews[i % sampleReviews.length]

      try {
        await prisma.review.create({
          data: {
            productId: product.id,
            userId: user.id,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            verified: Math.random() > 0.3,
          },
        })
        reviewCount++
      } catch (error) {
        // Ignorar errores de duplicados
      }
    }

    // Actualizar estadísticas de productos
    console.log('📊 Actualizando estadísticas de productos...')
    for (const product of products) {
      const [avgRating, totalReviews] = await Promise.all([
        prisma.review.aggregate({
          where: { productId: product.id },
          _avg: { rating: true },
        }),
        prisma.review.count({
          where: { productId: product.id },
        }),
      ])

      await prisma.product.update({
        where: { id: product.id },
        data: {
          averageRating: avgRating._avg.rating || 0,
          totalReviews,
        },
      })
    }

    console.log(`✅ ${reviewCount} reseñas creadas`)

    console.log('🎉 Migración completa finalizada!')
    console.log(`
📊 Resumen Final:
- ${categories.length} categorías
- ${productCount} productos REALES migrados
- ${createdUsers.length} usuarios de ejemplo
- ${reviewCount} reseñas de ejemplo
- Todas las imágenes y datos originales preservados

📦 Productos por categoría:
- Juguetes: ${JUGUETES_PRODUCTS.length} productos
- Tecnología: ${TECNOLOGIA_PRODUCTS.length} productos
`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  }
}

// Ejecutar
main()
  .catch((e) => {
    console.error('❌ Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })