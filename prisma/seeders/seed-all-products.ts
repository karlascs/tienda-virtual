/**
 * Seeder completo de todos los productos de IZA&CAS
 * Extrae productos de todas las páginas de categorías
 */

import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

// Mapeo de categorías
const CATEGORY_MAPPING: { [key: string]: string } = {
  'Electrodomésticos Pequeños': 'electrohogar',
  'Electrodomésticos': 'electrohogar',
  'Cocina': 'hogar',
  'Ropa de Cama': 'hogar',
  'Car': 'herramientas',
  'Iluminación': 'herramientas',
  'Herramientas': 'herramientas',
  'Juguetes': 'juguetes',
  'Juegos': 'juguetes',
  'Carpas': 'juguetes',
  'Librería': 'juguetes',
  'Audífonos': 'tecnologia',
  'Cámaras': 'tecnologia',
  'Celular': 'tecnologia',
  'Tecnología': 'tecnologia',
  'Camping': 'actividad',
  'Deporte': 'actividad',
  'Piscina': 'actividad',
  'Playa': 'actividad',
  'Actividad': 'actividad',
  'Cuidado Personal': 'cuidadopersonal',
  'Relajación': 'cuidadopersonal',
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

// Función para extraer productos de un archivo
async function extractProductsFromFile(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Buscar arrays de productos usando regex
    const productArrayRegex = /const\s+[A-Z_]*PRODUCTS[^=]*=\s*\[([\\s\\S]*?)\];/g
    const matches = [...content.matchAll(productArrayRegex)]
    
    const allProducts: any[] = []
    
    for (const match of matches) {
      const arrayContent = match[1]
      
      // Extraer objetos individuales de productos
      const productRegex = /\{([\\s\\S]*?)\},?\s*(?=\s*\{|\s*\])/g
      const productMatches = [...arrayContent.matchAll(productRegex)]
      
      for (const productMatch of productMatches) {
        try {
          const productStr = '{' + productMatch[1] + '}'
          
          // Extraer campos usando regex más específico
          const idMatch = productStr.match(/id:\s*(\d+)/)
          const nameMatch = productStr.match(/name:\s*["']([^"']+)["']/)
          const priceMatch = productStr.match(/price:\s*(\d+)/)
          const descriptionMatch = productStr.match(/description:\s*["']([^"']+)["']/)
          const categoryMatch = productStr.match(/category:\s*["']([^"']+)["']/)
          
          // Extraer imágenes
          const imageMatch = productStr.match(/image:\s*["']([^"']+)["']/)
          const imagesMatch = productStr.match(/images:\s*\[([^\]]+)\]/)
          
          let images: string[] = []
          if (imagesMatch) {
            const imagesList = imagesMatch[1].match(/["']([^"']+)["']/g)
            if (imagesList) {
              images = imagesList.map(img => img.replace(/["']/g, ''))
            }
          } else if (imageMatch) {
            images = [imageMatch[1]]
          }
          
          if (idMatch && nameMatch && priceMatch && descriptionMatch && categoryMatch) {
            const product = {
              id: parseInt(idMatch[1]),
              name: nameMatch[1],
              price: parseInt(priceMatch[1]),
              description: descriptionMatch[1],
              category: categoryMatch[1],
              images: images,
              image: images[0] || ''
            }
            
            allProducts.push(product)
          }
        } catch (error) {
          console.warn(`Error parsing product: ${error}`)
        }
      }
    }
    
    return allProducts
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return []
  }
}

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
    { regex: /(\d+)\s*L/i, template: (match: string) => `${match}L de capacidad` },
    { regex: /acero inoxidable/i, template: () => 'Acero inoxidable' },
    { regex: /eléctric/i, template: () => 'Eléctrico' },
    { regex: /LED/i, template: () => 'Tecnología LED' },
    { regex: /USB/i, template: () => 'Conexión USB' },
    { regex: /Bluetooth/i, template: () => 'Bluetooth' },
    { regex: /inalámbric/i, template: () => 'Inalámbrico' },
    { regex: /resistente/i, template: () => 'Resistente' },
    { regex: /portátil/i, template: () => 'Portátil' },
    { regex: /recargable/i, template: () => 'Recargable' },
    { regex: /multifuncional/i, template: () => 'Multifuncional' },
    { regex: /automático/i, template: () => 'Automático' },
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
  const brands = ['RAF', 'Ocean', 'MIXER', 'Air Power', 'Chiporro']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

// Función principal
async function main() {
  console.log('🌱 Iniciando extracción completa de productos IZA&CAS...')

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

    // 3. Extraer productos de todas las páginas
    console.log('📦 Extrayendo productos de todas las categorías...')
    
    const categoryFiles = [
      'src/app/products/electrohogar/page.tsx',
      'src/app/products/hogar/page.tsx',
      'src/app/products/herramientas/page.tsx',
      'src/app/products/juguetes/page.tsx',
      'src/app/products/tecnologia/page.tsx',
      'src/app/products/actividad/page.tsx',
      'src/app/products/cuidadopersonal/page.tsx',
    ]
    
    let allProducts: any[] = []
    
    for (const file of categoryFiles) {
      const filePath = path.join(process.cwd(), file)
      console.log(`  📄 Procesando ${file}...`)
      
      try {
        const products = await extractProductsFromFile(filePath)
        console.log(`    ✅ ${products.length} productos encontrados`)
        allProducts = [...allProducts, ...products]
      } catch (error) {
        console.error(`    ❌ Error procesando ${file}:`, error)
      }
    }
    
    // También extraer de products.ts
    const productsFile = path.join(process.cwd(), 'src/data/products.ts')
    console.log('  📄 Procesando src/data/products.ts...')
    const productsFromData = await extractProductsFromFile(productsFile)
    console.log(`    ✅ ${productsFromData.length} productos encontrados`)
    allProducts = [...allProducts, ...productsFromData]
    
    console.log(`🔍 Total de productos encontrados: ${allProducts.length}`)
    
    // 4. Procesar y crear productos
    console.log('🏗️  Creando productos en la base de datos...')
    let productCount = 0
    const processedIds = new Set()
    
    for (const product of allProducts) {
      // Evitar duplicados por ID
      if (processedIds.has(product.id)) {
        continue
      }
      processedIds.add(product.id)
      
      const categorySlug = CATEGORY_MAPPING[product.category] || 'hogar'
      const category = categories.find(cat => cat.slug === categorySlug)
      
      if (!category) {
        console.warn(`⚠️  Categoría no encontrada para: ${product.category} -> ${categorySlug}`)
        continue
      }

      // Generar slug único
      const baseSlug = product.name.toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/\\s+/g, '-')
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

    console.log(`✅ ${productCount} productos reales migrados exitosamente`)

    // 5. Crear usuarios y reseñas...
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

    // 6. Crear reseñas de ejemplo
    console.log('⭐ Creando reseñas de ejemplo...')
    const products = await prisma.product.findMany({ take: 25 })
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
    for (let i = 0; i < Math.min(products.length, 30); i++) {
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

    console.log('🎉 Migración completa de todos los productos finalizada!')
    console.log(`
📊 Resumen Final:
- ${categories.length} categorías
- ${productCount} productos REALES de todas las categorías
- ${createdUsers.length} usuarios de ejemplo
- ${reviewCount} reseñas de ejemplo
- Todas las imágenes y datos originales preservados
`)

  } catch (error) {
    console.error('❌ Error durante la migración completa:', error)
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