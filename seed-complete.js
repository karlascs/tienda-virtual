const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categoriesData = [
  {
    id: 1,
    name: 'Juguetes',
    slug: 'juguetes',
    description: 'Juguetes para niños de todas las edades',
    image: '/images/categorias/juguetes.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Tecnología',
    slug: 'tecnologia',
    description: 'Productos tecnológicos y electrónicos',
    image: '/images/categorias/tecnologia.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Hogar',
    slug: 'hogar',
    description: 'Artículos para el hogar y decoración',
    image: '/images/categorias/hogar.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: 'Electrohogar',
    slug: 'electrohogar',
    description: 'Electrodomésticos y artículos para el hogar',
    image: '/images/categorias/electrohogar.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Productos para el cuidado personal',
    image: '/images/categorias/cuidado-personal.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: 'Herramientas',
    slug: 'herramientas',
    description: 'Herramientas y accesorios',
    image: '/images/categorias/herramientas.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: 'Actividad',
    slug: 'actividad',
    description: 'Artículos para actividades y deportes',
    image: '/images/categorias/actividad.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const productsData = [
  // JUGUETES (Categoría 1)
  {
    name: 'Carpa Casita de Princesa',
    slug: 'carpa-casita-princesa',
    sku: 'JUG-001',
    description: 'Hermosa carpa en forma de castillo de princesa con detalles rosados y violetas. Incluye ventanas de malla y puerta enrollable. Ideal para juegos de interior.',
    price: 25990,
    stock: 15,
    categoryId: 1,
    images: ['/images/juguetes/carpa-princesa-1.jpg', '/images/juguetes/carpa-princesa-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Carpa de Castillo Infantil',
    slug: 'carpa-castillo-infantil',
    sku: 'JUG-002',
    description: 'Carpa espaciosa diseñada como castillo medieval. Perfecta para crear un espacio de juego mágico. Estructura resistente y fácil de armar.',
    price: 27990,
    stock: 12,
    categoryId: 1,
    images: ['/images/juguetes/carpa-castillo-1.jpg', '/images/juguetes/carpa-castillo-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Carpa Túnel',
    slug: 'carpa-tunel',
    sku: 'JUG-003',
    description: 'Carpa con túnel integrado para gatear. Estimula la actividad física y la coordinación. Colores brillantes y diseño llamativo.',
    price: 22990,
    stock: 20,
    categoryId: 1,
    images: ['/images/juguetes/carpa-tunel-1.jpg', '/images/juguetes/carpa-tunel-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Balón de Fútbol Air Power',
    slug: 'balon-futbol-air-power',
    sku: 'JUG-004',
    description: 'Balón flotante con luces LED. Funciona sobre superficies lisas. Incluye borde de espuma para proteger muebles.',
    price: 15990,
    stock: 25,
    categoryId: 1,
    images: ['/images/juguetes/balon-air-power-1.jpg', '/images/juguetes/balon-air-power-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Set de Cocina Kitchen',
    slug: 'set-cocina-kitchen',
    sku: 'JUG-005',
    description: 'Set completo de cocina de juguete con sonidos y luces. Incluye ollas, sartenes, cubiertos y alimentos de plástico. Fomenta el juego de roles.',
    price: 32990,
    stock: 10,
    categoryId: 1,
    images: ['/images/juguetes/cocina-1.jpg', '/images/juguetes/cocina-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mega Bloks 80 Piezas',
    slug: 'mega-bloks-80-piezas',
    sku: 'JUG-006',
    description: 'Set de bloques de construcción grandes. Perfectos para desarrollar habilidades motoras. Piezas en colores variados.',
    price: 18990,
    stock: 30,
    categoryId: 1,
    images: ['/images/juguetes/mega-bloks-1.jpg', '/images/juguetes/mega-bloks-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // TECNOLOGÍA (Categoría 2)
  {
    name: 'Proyector Astronauta Infantil',
    slug: 'proyector-astronauta-infantil',
    sku: 'TEC-001',
    description: 'Proyector LED con diseño de astronauta. Crea efectos de estrellas y nebulosas en el techo. Control remoto incluido.',
    price: 35990,
    stock: 8,
    categoryId: 2,
    images: ['/images/tecnologia/proyector-astronauta-1.jpg', '/images/tecnologia/proyector-astronauta-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Audífonos Inalámbricos IRM',
    slug: 'audifonos-inalambricos-irm',
    sku: 'TEC-002',
    description: 'Audífonos Bluetooth con cancelación de ruido. Batería de larga duración (20 horas). Sonido de alta calidad.',
    price: 28990,
    stock: 18,
    categoryId: 2,
    images: ['/images/tecnologia/audifonos-irm-1.jpg', '/images/tecnologia/audifonos-irm-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cámara de Seguridad 360°',
    slug: 'camara-seguridad-360',
    sku: 'TEC-003',
    description: 'Cámara WiFi con rotación 360°. Visión nocturna infrarroja. Detección de movimiento con alertas en smartphone.',
    price: 42990,
    stock: 14,
    categoryId: 2,
    images: ['/images/tecnologia/camara-360-1.jpg', '/images/tecnologia/camara-360-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mini Cámara Espía HD',
    slug: 'mini-camara-espia-hd',
    sku: 'TEC-004',
    description: 'Cámara compacta con grabación HD. Visión nocturna. Detección de movimiento. Batería recargable de larga duración.',
    price: 24990,
    stock: 22,
    categoryId: 2,
    images: ['/images/tecnologia/mini-camara-1.jpg', '/images/tecnologia/mini-camara-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cable USB Tipo C 3 Metros',
    slug: 'cable-usb-tipo-c-3m',
    sku: 'TEC-005',
    description: 'Cable USB-C de alta velocidad. 3 metros de largo. Carga rápida y transferencia de datos. Reforzado con trenzado de nylon.',
    price: 8990,
    stock: 50,
    categoryId: 2,
    images: ['/images/tecnologia/cable-usb-c-1.jpg', '/images/tecnologia/cable-usb-c-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Reloj Inteligente Smart Watch',
    slug: 'reloj-inteligente-smart-watch',
    sku: 'TEC-006',
    description: 'Smartwatch con monitor de ritmo cardíaco, contador de pasos, notificaciones y pantalla táctil. Resistente al agua.',
    price: 45990,
    stock: 12,
    categoryId: 2,
    images: ['/images/tecnologia/smartwatch-1.jpg', '/images/tecnologia/smartwatch-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // HOGAR (Categoría 3)
  {
    name: 'Set de Organizadores para Closet',
    slug: 'set-organizadores-closet',
    sku: 'HOG-001',
    description: 'Set de 6 organizadores de tela para ropa interior, calcetines y accesorios. Incluye diferentes tamaños.',
    price: 12990,
    stock: 25,
    categoryId: 3,
    images: ['/images/hogar/organizadores-closet-1.jpg', '/images/hogar/organizadores-closet-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lámpara LED de Mesa',
    slug: 'lampara-led-mesa',
    sku: 'HOG-002',
    description: 'Lámpara LED con brazo flexible. 3 niveles de intensidad. Puerto USB para cargar dispositivos. Perfecta para escritorio.',
    price: 19990,
    stock: 18,
    categoryId: 3,
    images: ['/images/hogar/lampara-led-1.jpg', '/images/hogar/lampara-led-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cojines Decorativos Set x4',
    slug: 'cojines-decorativos-set-4',
    sku: 'HOG-003',
    description: 'Set de 4 cojines decorativos con diseños geométricos. Fundas lavables. 45x45cm cada uno.',
    price: 16990,
    stock: 20,
    categoryId: 3,
    images: ['/images/hogar/cojines-1.jpg', '/images/hogar/cojines-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Espejo de Pared Decorativo',
    slug: 'espejo-pared-decorativo',
    sku: 'HOG-004',
    description: 'Espejo redondo con marco dorado. 60cm de diámetro. Perfecto para sala o dormitorio. Incluye kit de instalación.',
    price: 34990,
    stock: 8,
    categoryId: 3,
    images: ['/images/hogar/espejo-decorativo-1.jpg', '/images/hogar/espejo-decorativo-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ELECTROHOGAR (Categoría 4)
  {
    name: 'Aspiradora Robot Inteligente',
    slug: 'aspiradora-robot-inteligente',
    sku: 'ELE-001',
    description: 'Aspiradora robot con navegación inteligente. Control via app. Batería de larga duración. Ideal para pisos y alfombras.',
    price: 89990,
    stock: 6,
    categoryId: 4,
    images: ['/images/electro hogar/aspiradora-robot-1.jpg', '/images/electro hogar/aspiradora-robot-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Licuadora de Alta Potencia',
    slug: 'licuadora-alta-potencia',
    sku: 'ELE-002',
    description: 'Licuadora de 1200W con jarra de vidrio. 5 velocidades. Cuchillas de acero inoxidable. Perfecta para smoothies.',
    price: 42990,
    stock: 10,
    categoryId: 4,
    images: ['/images/electro hogar/licuadora-1.jpg', '/images/electro hogar/licuadora-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Freidora de Aire 5L',
    slug: 'freidora-aire-5l',
    sku: 'ELE-003',
    description: 'Freidora de aire de 5 litros. Cocción sin aceite. 8 programas predefinidos. Temperatura ajustable hasta 200°C.',
    price: 69990,
    stock: 8,
    categoryId: 4,
    images: ['/images/electro hogar/freidora-aire-1.jpg', '/images/electro hogar/freidora-aire-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cafetera Express',
    slug: 'cafetera-express',
    sku: 'ELE-004',
    description: 'Cafetera para café espresso y capuccino. 15 bares de presión. Vaporizador para espumar leche. Sistema antigoteo.',
    price: 54990,
    stock: 12,
    categoryId: 4,
    images: ['/images/electro hogar/cafetera-express-1.jpg', '/images/electro hogar/cafetera-express-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // CUIDADO PERSONAL (Categoría 5)
  {
    name: 'Secador de Pelo Profesional',
    slug: 'secador-pelo-profesional',
    sku: 'CUI-001',
    description: 'Secador de pelo iónico 2000W. 3 temperaturas y 2 velocidades. Boquilla concentradora incluida. Cable giratorio.',
    price: 32990,
    stock: 15,
    categoryId: 5,
    images: ['/images/cuidadopersonal/secador-1.jpg', '/images/cuidadopersonal/secador-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Plancha de Pelo Cerámica',
    slug: 'plancha-pelo-ceramica',
    sku: 'CUI-002',
    description: 'Plancha alisadora con placas de cerámica turmalina. Temperatura ajustable hasta 230°C. Calentamiento rápido.',
    price: 28990,
    stock: 18,
    categoryId: 5,
    images: ['/images/cuidadopersonal/plancha-pelo-1.jpg', '/images/cuidadopersonal/plancha-pelo-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Afeitadora Eléctrica 3 Cabezales',
    slug: 'afeitadora-electrica-3-cabezales',
    sku: 'CUI-003',
    description: 'Afeitadora rotativa con 3 cabezales flotantes. Uso en seco y húmedo. Batería recargable. Incluye estuche de viaje.',
    price: 38990,
    stock: 10,
    categoryId: 5,
    images: ['/images/cuidadopersonal/afeitadora-1.jpg', '/images/cuidadopersonal/afeitadora-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Set de Pedicure Eléctrico',
    slug: 'set-pedicure-electrico',
    sku: 'CUI-004',
    description: 'Kit eléctrico para pedicure con 6 cabezales intercambiables. Lima callos y suaviza piel. Incluye estuche.',
    price: 19990,
    stock: 20,
    categoryId: 5,
    images: ['/images/cuidadopersonal/pedicure-1.jpg', '/images/cuidadopersonal/pedicure-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // HERRAMIENTAS (Categoría 6)
  {
    name: 'Taladro Inalámbrico 20V',
    slug: 'taladro-inalambrico-20v',
    sku: 'HER-001',
    description: 'Taladro inalámbrico con batería de litio 20V. 2 velocidades. Portabrocas automático. Incluye maletín y accesorios.',
    price: 59990,
    stock: 8,
    categoryId: 6,
    images: ['/images/herramientas/taladro-inalambrico-1.jpg', '/images/herramientas/taladro-inalambrico-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Set de Herramientas 120 Piezas',
    slug: 'set-herramientas-120-piezas',
    sku: 'HER-002',
    description: 'Set completo con 120 herramientas. Incluye destornilladores, llaves, martillo, alicate y más. Maletín organizado.',
    price: 45990,
    stock: 12,
    categoryId: 6,
    images: ['/images/herramientas/set-herramientas-1.jpg', '/images/herramientas/set-herramientas-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Soldador Eléctrico 60W',
    slug: 'soldador-electrico-60w',
    sku: 'HER-003',
    description: 'Soldador eléctrico de 60W con temperatura ajustable. Incluye soporte, estaño y puntas intercambiables.',
    price: 16990,
    stock: 15,
    categoryId: 6,
    images: ['/images/herramientas/soldador-1.jpg', '/images/herramientas/soldador-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Escalera Telescópica Aluminio',
    slug: 'escalera-telescopica-aluminio',
    sku: 'HER-004',
    description: 'Escalera telescópica de aluminio. Extensión hasta 3.8 metros. Sistema de bloqueo seguro. Compacta para guardar.',
    price: 89990,
    stock: 5,
    categoryId: 6,
    images: ['/images/herramientas/escalera-telescopica-1.jpg', '/images/herramientas/escalera-telescopica-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ACTIVIDAD (Categoría 7)
  {
    name: 'Bicicleta Estática Plegable',
    slug: 'bicicleta-estatica-plegable',
    sku: 'ACT-001',
    description: 'Bicicleta estática con monitor LCD. 8 niveles de resistencia. Asiento ajustable. Plegable para ahorrar espacio.',
    price: 89990,
    stock: 6,
    categoryId: 7,
    images: ['/images/actividad/bicicleta-estatica-1.jpg', '/images/actividad/bicicleta-estatica-2.jpg'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Set de Pesas Ajustables 20kg',
    slug: 'set-pesas-ajustables-20kg',
    sku: 'ACT-002',
    description: 'Set de mancuernas ajustables de 5 a 20kg. Sistema de cambio rápido de peso. Incluye base de almacenamiento.',
    price: 79990,
    stock: 8,
    categoryId: 7,
    images: ['/images/actividad/pesas-ajustables-1.jpg', '/images/actividad/pesas-ajustables-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Colchoneta de Yoga Premium',
    slug: 'colchoneta-yoga-premium',
    sku: 'ACT-003',
    description: 'Colchoneta de yoga antideslizante. 6mm de grosor. Material ecológico TPE. Incluye correa de transporte.',
    price: 18990,
    stock: 25,
    categoryId: 7,
    images: ['/images/actividad/colchoneta-yoga-1.jpg', '/images/actividad/colchoneta-yoga-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cuerda para Saltar Digital',
    slug: 'cuerda-saltar-digital',
    sku: 'ACT-004',
    description: 'Cuerda para saltar con contador digital. Registra saltos, calorías y tiempo. Cable ajustable. Ideal para cardio.',
    price: 12990,
    stock: 30,
    categoryId: 7,
    images: ['/images/actividad/cuerda-digital-1.jpg', '/images/actividad/cuerda-digital-2.jpg'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function main() {
  console.log('🌱 Iniciando carga completa de datos...\n')

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Datos limpiados\n')

  // Crear categorías
  console.log('📁 Creando categorías...')
  for (const category of categoriesData) {
    await prisma.category.create({ data: category })
    console.log(`  ✅ ${category.name}`)
  }
  console.log(`✅ ${categoriesData.length} categorías creadas\n`)

  // Crear productos
  console.log('📦 Creando productos...')
  for (const product of productsData) {
    await prisma.product.create({ data: product })
    console.log(`  ✅ ${product.name} - $${product.price}`)
  }
  console.log(`\n✅ ${productsData.length} productos creados\n`)

  // Resumen por categoría
  console.log('📊 Resumen por categoría:')
  for (const category of categoriesData) {
    const count = await prisma.product.count({
      where: { categoryId: category.id }
    })
    console.log(`  ${category.name}: ${count} productos`)
  }

  console.log('\n🎉 ¡Carga completa exitosa!')
  console.log('📝 Total: 7 categorías, 33 productos')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
