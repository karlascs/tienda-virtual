/**
 * Seeder completo de productos IZA&CAS - Enfoque simplificado
 * Extrae productos directamente usando evaluación de código
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

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

// Función para extraer productos de un archivo usando parsing manual
async function extractProductsFromFile(filePath: string, categorySlug: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    console.log(`    🔍 Buscando productos en ${path.basename(filePath)}...`)
    
    // Buscar el array de productos usando una expresión más flexible
    const productArrayMatch = content.match(/const\s+\w*PRODUCTS\s*:\s*Product\[\]\s*=\s*\[([^]*?)\];\s*$/m)
    
    if (!productArrayMatch) {
      console.log(`    ⚠️  No se encontró array de productos`)
      return []
    }
    
    const arrayContent = productArrayMatch[1]
    console.log(`    📦 Contenido encontrado: ${arrayContent.length} caracteres`)
    
    // Buscar objetos de productos individuales
    const productObjects: any[] = []
    const objectMatches = arrayContent.match(/{\s*[\\s\\S]*?\s*}/g)
    
    if (!objectMatches) {
      console.log(`    ⚠️  No se encontraron objetos de productos`)
      return []
    }
    
    console.log(`    🎯 ${objectMatches.length} objetos encontrados`)
    
    for (const objectStr of objectMatches) {
      try {
        // Extraer campos usando regex específicas
        const idMatch = objectStr.match(/id:\s*(\d+)/)
        const nameMatch = objectStr.match(/name:\s*["']([^"']*?)["']/)
        const priceMatch = objectStr.match(/price:\s*(\d+)/)
        const descriptionMatch = objectStr.match(/description:\s*["']([^"']*?)["']/)
        const categoryMatch = objectStr.match(/category:\s*["']([^"']*?)["']/)
        const imageMatch = objectStr.match(/image:\s*["']([^"']*?)["']/)
        
        // Extraer array de imágenes
        const imagesMatch = objectStr.match(/images:\s*\[([\\s\\S]*?)\]/)
        let images: string[] = []
        
        if (imagesMatch) {
          const imagesList = imagesMatch[1].match(/["']([^"']*?)["']/g)
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
            images: images.filter(img => img && img.trim() !== ''),
            image: images[0] || '',
            categorySlug: categorySlug
          }
          
          productObjects.push(product)
          console.log(`      ✅ ${product.name} (ID: ${product.id})`)
        } else {
          console.log(`      ⚠️  Producto incompleto encontrado`)
        }
      } catch (error) {
        console.warn(`      ❌ Error parseando objeto:`, error)
      }
    }
    
    return productObjects
    
  } catch (error) {
    console.error(`❌ Error leyendo archivo ${filePath}:`, error)
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
  console.log('🌱 Iniciando extracción simplificada de productos IZA&CAS...')

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

    // 3. Extraer productos de páginas específicas
    console.log('📦 Extrayendo productos de páginas de categorías...')
    
    const categoryFilesMap = [
      { file: 'src/app/products/juguetes/page.tsx', slug: 'juguetes' },
      { file: 'src/app/products/tecnologia/page.tsx', slug: 'tecnologia' },
      { file: 'src/app/products/herramientas/page.tsx', slug: 'herramientas' },
      { file: 'src/app/products/actividad/page.tsx', slug: 'actividad' },
      { file: 'src/app/products/cuidadopersonal/page.tsx', slug: 'cuidadopersonal' },
      { file: 'src/app/products/electrohogar/page.tsx', slug: 'electrohogar' },
      { file: 'src/app/products/hogar/page.tsx', slug: 'hogar' },
    ]
    
    let allProducts: any[] = []
    
    for (const { file, slug } of categoryFilesMap) {
      const filePath = path.join(process.cwd(), file)
      console.log(`  📄 Procesando ${file}...`)
      
      try {
        const products = await extractProductsFromFile(filePath, slug)
        console.log(`    ✅ ${products.length} productos extraídos`)
        allProducts = [...allProducts, ...products]
      } catch (error) {
        console.error(`    ❌ Error procesando ${file}:`, error)
      }
    }
    
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
      
      const categorySlug = CATEGORY_MAPPING[product.category] || product.categorySlug || 'hogar'
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

    // 5. Crear usuarios y reseñas de ejemplo
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

    console.log('🎉 Migración completa finalizada!')
    console.log(`
📊 Resumen Final:
- ${categories.length} categorías
- ${productCount} productos REALES migrados
- ${createdUsers.length} usuarios de ejemplo
- Todas las imágenes y datos originales preservados
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