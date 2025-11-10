/**
 * Seeder de productos reales para IZA&CAS E-commerce
 * Migra TODOS los productos reales de products.ts a la base de datos Prisma
 */

import { PrismaClient } from '@prisma/client'
import { getAllProducts } from '../../src/data/products'

const prisma = new PrismaClient()

// Mapeo de categorías del sistema actual al nuevo schema
const CATEGORY_MAPPING: { [key: string]: string } = {
  'Cocina': 'hogar',
  'Electrodomésticos': 'electrohogar', 
  'Ropa de Cama': 'hogar',
  'Herramientas': 'herramientas',
  'Iluminación': 'herramientas',
  'Carros': 'herramientas',
  'Juguetes': 'juguetes',
  'Juegos': 'juguetes',
  'Carpas': 'juguetes',
  'Librería': 'juguetes',
  'Audífonos': 'tecnologia',
  'Cámaras': 'tecnologia',
  'Celular': 'tecnologia',
  'Camping': 'actividad',
  'Deporte': 'actividad',
  'Piscina': 'actividad',
  'Playa': 'actividad',
  'Cuidado Personal': 'cuidadopersonal',
  'Máquina Afeitar': 'cuidadopersonal',
  'Relajación': 'cuidadopersonal',
}

// Datos de categorías actualizados
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

// Función para determinar la categoría del producto
function getCategorySlug(productCategory: string): string {
  return CATEGORY_MAPPING[productCategory] || 'hogar'
}

// Función para extraer características del nombre y descripción
function extractFeatures(product: any): string[] {
  const features: string[] = []
  
  // Extraer características de la descripción
  const description = product.description || ''
  
  // Buscar patrones comunes
  if (description.includes('tazas')) {
    const match = description.match(/(\d+)\s*tazas/i)
    if (match) features.push(`${match[1]} tazas`)
  }
  
  if (description.includes('plazas')) {
    const match = description.match(/(\d+)\s*plazas/i)
    if (match) features.push(`${match[1]} plazas`)
  }
  
  if (description.includes('acero inoxidable')) features.push('Acero inoxidable')
  if (description.includes('eléctric')) features.push('Eléctrico')
  if (description.includes('LED')) features.push('Tecnología LED')
  if (description.includes('USB')) features.push('Conexión USB')
  if (description.includes('Bluetooth')) features.push('Bluetooth')
  if (description.includes('inalámbric')) features.push('Inalámbrico')
  if (description.includes('resistente')) features.push('Resistente')
  if (description.includes('portátil')) features.push('Portátil')
  if (description.includes('recargable')) features.push('Recargable')
  
  return features.length > 0 ? features : ['Producto de calidad']
}

// Función para extraer marca del nombre
function extractBrand(name: string): string {
  const brands = ['RAF', 'Ocean', 'MIXER', 'Air Power']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

// Función principal de seeding
async function main() {
  console.log('🌱 Iniciando seeding con productos REALES de IZA&CAS...')

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

    // 3. Importar productos reales
    console.log('📦 Importando productos REALES desde products.ts...')
    const realProducts = getAllProducts()
    console.log(`🔍 Encontrados ${realProducts.length} productos para migrar`)

    let productCount = 0
    
    for (const product of realProducts) {
      const categorySlug = getCategorySlug(product.category || '')
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

      // Manejar imágenes
      const images = product.images || [product.image]
      const validImages = images.filter((img: string | undefined): img is string => 
        typeof img === 'string' && img.trim() !== ''
      )

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
            stock: Math.floor(Math.random() * 20) + 5, // Stock aleatorio entre 5-25
            isFeatured: Math.random() > 0.8, // 20% de productos destacados
            categoryId: category.id,
          },
        })

        productCount++
        console.log(`  ✅ ${productCount}. ${createdProduct.name} (${category.name})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`✅ ${productCount} productos reales migrados exitosamente`)

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
        email: 'cliente1@example.com',
        name: 'María González',
        hashedPassword: '$2b$10$rQ8KqK9zYzQqYzQqYzQqYe',
        verified: true,
        address: 'Av. Providencia 1234',
        city: 'Santiago',
        zipCode: '7500001',
      },
      {
        email: 'cliente2@example.com',
        name: 'Juan Pérez',
        hashedPassword: '$2b$10$rQ8KqK9zYzQqYzQqYzQqYe',
        verified: true,
        address: 'Calle Las Flores 567',
        city: 'Santiago',
        zipCode: '7500002',
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

    // 5. Crear reseñas de ejemplo para algunos productos
    console.log('⭐ Creando reseñas de ejemplo...')
    const products = await prisma.product.findMany({ take: 15 })
    const sampleReviews = [
      { rating: 5, title: 'Excelente producto', comment: 'Muy satisfecho con la compra, cumple todas las expectativas.' },
      { rating: 4, title: 'Muy bueno', comment: 'Buena calidad, aunque el precio podría ser mejor.' },
      { rating: 5, title: 'Recomendado', comment: 'Llegó rápido y en perfectas condiciones. Lo recomiendo.' },
      { rating: 4, title: 'Buena experiencia', comment: 'Funciona como se esperaba, buen servicio al cliente.' },
      { rating: 5, title: 'Perfecto', comment: 'Exactamente lo que necesitaba, calidad premium.' },
      { rating: 3, title: 'Regular', comment: 'Cumple su función pero esperaba un poco más de calidad.' },
      { rating: 4, title: 'Buena compra', comment: 'Buen producto, relación precio-calidad aceptable.' },
    ]

    let reviewCount = 0
    for (let i = 0; i < Math.min(products.length, 20); i++) {
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
            verified: Math.random() > 0.3, // 70% reseñas verificadas
          },
        })
        reviewCount++
      } catch (error) {
        // Ignorar errores de reseñas duplicadas
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

    console.log('🎉 Migración de productos reales completada exitosamente!')
    console.log(`
📊 Resumen Final:
- ${categories.length} categorías
- ${productCount} productos REALES migrados desde products.ts
- ${createdUsers.length} usuarios de ejemplo
- ${reviewCount} reseñas de ejemplo
- Todas las imágenes y datos originales preservados
`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  }
}

// Ejecutar el seeder
main()
  .catch((e) => {
    console.error('❌ Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })