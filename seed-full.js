const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando carga completa de datos...\n')

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('✅ Datos limpiados\n')

  // Crear categorías
  console.log('📁 Creando categorías...')
  
  const juguetes = await prisma.category.create({
    data: {
      name: 'Juguetes',
      slug: 'juguetes',
      description: 'Juguetes para niños de todas las edades',
      image: '/images/categorias/juguetes.jpg'
    }
  })
  console.log('  ✅ Juguetes')

  const tecnologia = await prisma.category.create({
    data: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Productos tecnológicos y electrónicos',
      image: '/images/categorias/tecnologia.jpg'
    }
  })
  console.log('  ✅ Tecnología')

  const hogar = await prisma.category.create({
    data: {
      name: 'Hogar',
      slug: 'hogar',
      description: 'Artículos para el hogar y decoración',
      image: '/images/categorias/hogar.jpg'
    }
  })
  console.log('  ✅ Hogar')

  const electrohogar = await prisma.category.create({
    data: {
      name: 'Electrohogar',
      slug: 'electrohogar',
      description: 'Electrodomésticos y artículos para el hogar',
      image: '/images/categorias/electrohogar.jpg'
    }
  })
  console.log('  ✅ Electrohogar')

  const cuidadoPersonal = await prisma.category.create({
    data: {
      name: 'Cuidado Personal',
      slug: 'cuidado-personal',
      description: 'Productos para el cuidado personal',
      image: '/images/categorias/cuidado-personal.jpg'
    }
  })
  console.log('  ✅ Cuidado Personal')

  const herramientas = await prisma.category.create({
    data: {
      name: 'Herramientas',
      slug: 'herramientas',
      description: 'Herramientas y accesorios',
      image: '/images/categorias/herramientas.jpg'
    }
  })
  console.log('  ✅ Herramientas')

  const actividad = await prisma.category.create({
    data: {
      name: 'Actividad',
      slug: 'actividad',
      description: 'Artículos para actividades y deportes',
      image: '/images/categorias/actividad.jpg'
    }
  })
  console.log('  ✅ Actividad\n')

  // Crear productos
  console.log('📦 Creando productos de JUGUETES...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Carpa Casita de Princesa',
        slug: 'carpa-casita-princesa',
        sku: 'JUG-001',
        description: 'Hermosa carpa en forma de castillo de princesa con detalles rosados y violetas. Incluye ventanas de malla y puerta enrollable.',
        price: 25990,
        stock: 15,
        categoryId: juguetes.id,
        images: ['/images/juguetes/carpa-princesa-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Carpa de Castillo Infantil',
        slug: 'carpa-castillo-infantil',
        sku: 'JUG-002',
        description: 'Carpa espaciosa diseñada como castillo medieval. Perfecta para crear un espacio de juego mágico.',
        price: 27990,
        stock: 12,
        categoryId: juguetes.id,
        images: ['/images/juguetes/carpa-castillo-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Carpa Túnel',
        slug: 'carpa-tunel',
        sku: 'JUG-003',
        description: 'Carpa con túnel integrado para gatear. Estimula la actividad física y la coordinación.',
        price: 22990,
        stock: 20,
        categoryId: juguetes.id,
        images: ['/images/juguetes/carpa-tunel-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Balón de Fútbol Air Power',
        slug: 'balon-futbol-air-power',
        sku: 'JUG-004',
        description: 'Balón flotante con luces LED. Funciona sobre superficies lisas. Incluye borde de espuma.',
        price: 15990,
        stock: 25,
        categoryId: juguetes.id,
        images: ['/images/juguetes/balon-air-power-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Set de Cocina Kitchen',
        slug: 'set-cocina-kitchen',
        sku: 'JUG-005',
        description: 'Set completo de cocina de juguete con sonidos y luces. Fomenta el juego de roles.',
        price: 32990,
        stock: 10,
        categoryId: juguetes.id,
        images: ['/images/juguetes/cocina-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Mega Bloks 80 Piezas',
        slug: 'mega-bloks-80-piezas',
        sku: 'JUG-006',
        description: 'Set de bloques de construcción grandes. Perfectos para desarrollar habilidades motoras.',
        price: 18990,
        stock: 30,
        categoryId: juguetes.id,
        images: ['/images/juguetes/mega-bloks-1.jpg'],
        isFeatured: false
      }
    ]
  })
  console.log('✅ 6 productos de Juguetes creados\n')

  console.log('📦 Creando productos de TECNOLOGÍA...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Proyector Astronauta Infantil',
        slug: 'proyector-astronauta-infantil',
        sku: 'TEC-001',
        description: 'Proyector LED con diseño de astronauta. Crea efectos de estrellas y nebulosas. Control remoto incluido.',
        price: 35990,
        stock: 8,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/proyector-astronauta-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Audífonos Inalámbricos IRM',
        slug: 'audifonos-inalambricos-irm',
        sku: 'TEC-002',
        description: 'Audífonos Bluetooth con cancelación de ruido. Batería de 20 horas. Sonido de alta calidad.',
        price: 28990,
        stock: 18,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/audifonos-irm-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Cámara de Seguridad 360°',
        slug: 'camara-seguridad-360',
        sku: 'TEC-003',
        description: 'Cámara WiFi con rotación 360°. Visión nocturna. Detección de movimiento con alertas.',
        price: 42990,
        stock: 14,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/camara-360-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Mini Cámara Espía HD',
        slug: 'mini-camara-espia-hd',
        sku: 'TEC-004',
        description: 'Cámara compacta con grabación HD. Visión nocturna. Detección de movimiento.',
        price: 24990,
        stock: 22,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/mini-camara-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Cable USB Tipo C 3 Metros',
        slug: 'cable-usb-tipo-c-3m',
        sku: 'TEC-005',
        description: 'Cable USB-C de alta velocidad. Carga rápida. Reforzado con trenzado de nylon.',
        price: 8990,
        stock: 50,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/cable-usb-c-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Reloj Inteligente Smart Watch',
        slug: 'reloj-inteligente-smart-watch',
        sku: 'TEC-006',
        description: 'Smartwatch con monitor cardíaco, contador de pasos y notificaciones. Resistente al agua.',
        price: 45990,
        stock: 12,
        categoryId: tecnologia.id,
        images: ['/images/tecnologia/smartwatch-1.jpg'],
        isFeatured: true
      }
    ]
  })
  console.log('✅ 6 productos de Tecnología creados\n')

  console.log('📦 Creando productos de HOGAR...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Set de Organizadores para Closet',
        slug: 'set-organizadores-closet',
        sku: 'HOG-001',
        description: 'Set de 6 organizadores de tela para ropa interior, calcetines y accesorios.',
        price: 12990,
        stock: 25,
        categoryId: hogar.id,
        images: ['/images/hogar/organizadores-closet-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Lámpara LED de Mesa',
        slug: 'lampara-led-mesa',
        sku: 'HOG-002',
        description: 'Lámpara LED con brazo flexible. 3 niveles de intensidad. Puerto USB para cargar.',
        price: 19990,
        stock: 18,
        categoryId: hogar.id,
        images: ['/images/hogar/lampara-led-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Cojines Decorativos Set x4',
        slug: 'cojines-decorativos-set-4',
        sku: 'HOG-003',
        description: 'Set de 4 cojines decorativos con diseños geométricos. Fundas lavables. 45x45cm.',
        price: 16990,
        stock: 20,
        categoryId: hogar.id,
        images: ['/images/hogar/cojines-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Espejo de Pared Decorativo',
        slug: 'espejo-pared-decorativo',
        sku: 'HOG-004',
        description: 'Espejo redondo con marco dorado. 60cm de diámetro. Incluye kit de instalación.',
        price: 34990,
        stock: 8,
        categoryId: hogar.id,
        images: ['/images/hogar/espejo-decorativo-1.jpg'],
        isFeatured: true
      }
    ]
  })
  console.log('✅ 4 productos de Hogar creados\n')

  console.log('📦 Creando productos de ELECTROHOGAR...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Aspiradora Robot Inteligente',
        slug: 'aspiradora-robot-inteligente',
        sku: 'ELE-001',
        description: 'Aspiradora robot con navegación inteligente. Control via app. Ideal para pisos y alfombras.',
        price: 89990,
        stock: 6,
        categoryId: electrohogar.id,
        images: ['/images/electro hogar/aspiradora-robot-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Licuadora de Alta Potencia',
        slug: 'licuadora-alta-potencia',
        sku: 'ELE-002',
        description: 'Licuadora de 1200W con jarra de vidrio. 5 velocidades. Perfecta para smoothies.',
        price: 42990,
        stock: 10,
        categoryId: electrohogar.id,
        images: ['/images/electro hogar/licuadora-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Freidora de Aire 5L',
        slug: 'freidora-aire-5l',
        sku: 'ELE-003',
        description: 'Freidora de aire de 5 litros. Cocción sin aceite. 8 programas predefinidos.',
        price: 69990,
        stock: 8,
        categoryId: electrohogar.id,
        images: ['/images/electro hogar/freidora-aire-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Cafetera Express',
        slug: 'cafetera-express',
        sku: 'ELE-004',
        description: 'Cafetera espresso y capuccino. 15 bares de presión. Vaporizador para espumar leche.',
        price: 54990,
        stock: 12,
        categoryId: electrohogar.id,
        images: ['/images/electro hogar/cafetera-express-1.jpg'],
        isFeatured: false
      }
    ]
  })
  console.log('✅ 4 productos de Electrohogar creados\n')

  console.log('📦 Creando productos de CUIDADO PERSONAL...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Secador de Pelo Profesional',
        slug: 'secador-pelo-profesional',
        sku: 'CUI-001',
        description: 'Secador iónico 2000W. 3 temperaturas y 2 velocidades. Boquilla concentradora incluida.',
        price: 32990,
        stock: 15,
        categoryId: cuidadoPersonal.id,
        images: ['/images/cuidadopersonal/secador-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Plancha de Pelo Cerámica',
        slug: 'plancha-pelo-ceramica',
        sku: 'CUI-002',
        description: 'Plancha alisadora con placas de cerámica turmalina. Temperatura ajustable hasta 230°C.',
        price: 28990,
        stock: 18,
        categoryId: cuidadoPersonal.id,
        images: ['/images/cuidadopersonal/plancha-pelo-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Afeitadora Eléctrica 3 Cabezales',
        slug: 'afeitadora-electrica-3-cabezales',
        sku: 'CUI-003',
        description: 'Afeitadora rotativa con 3 cabezales flotantes. Uso en seco y húmedo. Batería recargable.',
        price: 38990,
        stock: 10,
        categoryId: cuidadoPersonal.id,
        images: ['/images/cuidadopersonal/afeitadora-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Set de Pedicure Eléctrico',
        slug: 'set-pedicure-electrico',
        sku: 'CUI-004',
        description: 'Kit eléctrico para pedicure con 6 cabezales intercambiables. Lima callos y suaviza piel.',
        price: 19990,
        stock: 20,
        categoryId: cuidadoPersonal.id,
        images: ['/images/cuidadopersonal/pedicure-1.jpg'],
        isFeatured: false
      }
    ]
  })
  console.log('✅ 4 productos de Cuidado Personal creados\n')

  console.log('📦 Creando productos de HERRAMIENTAS...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Taladro Inalámbrico 20V',
        slug: 'taladro-inalambrico-20v',
        sku: 'HER-001',
        description: 'Taladro con batería de litio 20V. 2 velocidades. Incluye maletín y accesorios.',
        price: 59990,
        stock: 8,
        categoryId: herramientas.id,
        images: ['/images/herramientas/taladro-inalambrico-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Set de Herramientas 120 Piezas',
        slug: 'set-herramientas-120-piezas',
        sku: 'HER-002',
        description: 'Set completo con 120 herramientas. Incluye destornilladores, llaves, martillo y más.',
        price: 45990,
        stock: 12,
        categoryId: herramientas.id,
        images: ['/images/herramientas/set-herramientas-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Soldador Eléctrico 60W',
        slug: 'soldador-electrico-60w',
        sku: 'HER-003',
        description: 'Soldador de 60W con temperatura ajustable. Incluye soporte, estaño y puntas.',
        price: 16990,
        stock: 15,
        categoryId: herramientas.id,
        images: ['/images/herramientas/soldador-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Escalera Telescópica Aluminio',
        slug: 'escalera-telescopica-aluminio',
        sku: 'HER-004',
        description: 'Escalera telescópica hasta 3.8 metros. Sistema de bloqueo seguro. Compacta.',
        price: 89990,
        stock: 5,
        categoryId: herramientas.id,
        images: ['/images/herramientas/escalera-telescopica-1.jpg'],
        isFeatured: true
      }
    ]
  })
  console.log('✅ 4 productos de Herramientas creados\n')

  console.log('📦 Creando productos de ACTIVIDAD...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Bicicleta Estática Plegable',
        slug: 'bicicleta-estatica-plegable',
        sku: 'ACT-001',
        description: 'Bicicleta estática con monitor LCD. 8 niveles de resistencia. Plegable.',
        price: 89990,
        stock: 6,
        categoryId: actividad.id,
        images: ['/images/actividad/bicicleta-estatica-1.jpg'],
        isFeatured: true
      },
      {
        name: 'Set de Pesas Ajustables 20kg',
        slug: 'set-pesas-ajustables-20kg',
        sku: 'ACT-002',
        description: 'Mancuernas ajustables de 5 a 20kg. Sistema de cambio rápido. Base incluida.',
        price: 79990,
        stock: 8,
        categoryId: actividad.id,
        images: ['/images/actividad/pesas-ajustables-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Colchoneta de Yoga Premium',
        slug: 'colchoneta-yoga-premium',
        sku: 'ACT-003',
        description: 'Colchoneta antideslizante 6mm. Material ecológico TPE. Correa de transporte incluida.',
        price: 18990,
        stock: 25,
        categoryId: actividad.id,
        images: ['/images/actividad/colchoneta-yoga-1.jpg'],
        isFeatured: false
      },
      {
        name: 'Cuerda para Saltar Digital',
        slug: 'cuerda-saltar-digital',
        sku: 'ACT-004',
        description: 'Cuerda con contador digital. Registra saltos, calorías y tiempo. Cable ajustable.',
        price: 12990,
        stock: 30,
        categoryId: actividad.id,
        images: ['/images/actividad/cuerda-digital-1.jpg'],
        isFeatured: false
      }
    ]
  })
  console.log('✅ 4 productos de Actividad creados\n')

  // Resumen final
  const totalCategories = await prisma.category.count()
  const totalProducts = await prisma.product.count()

  console.log('📊 RESUMEN FINAL:')
  console.log(`  ├─ Categorías: ${totalCategories}`)
  console.log(`  └─ Productos: ${totalProducts}\n`)

  console.log('📝 Productos por categoría:')
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
  
  categories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat._count.products} productos`)
  })

  console.log('\n🎉 ¡Base de datos completamente cargada!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
