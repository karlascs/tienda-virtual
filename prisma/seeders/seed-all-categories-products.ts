import { prisma } from '../../src/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Seeder que carga TODOS los productos de TODAS las categorías
 * Escanea las carpetas de imágenes y crea productos en la base de datos
 */

interface ProductToCreate {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  images: string[]
  categorySlug: string
  isActive: boolean
}

// Mapeo de carpetas a categorías en la BD
const CATEGORY_MAP: Record<string, string> = {
  'actividad': 'actividad',
  'cuidadopersonal': 'cuidadopersonal',
  'electro hogar': 'electrohogar',
  'herramientas': 'herramientas',
  'hogar': 'hogar',
  'juguetes': 'juguetes',
  'tecnologia': 'tecnologia'
}

// Precios sugeridos por subcategoría
const PRICE_MAP: Record<string, number> = {
  // Actividad
  'camping': 15990,
  'deporte': 12990,
  'piscina': 18990,
  'playa': 14990,
  
  // Herramientas
  'car': 14990,
  'iluminacion': 21990,
  
  // Hogar
  'cocina': 12990,
  'electrodomesticos': 16990,
  'ropa de cama': 32990,
  'alfombras': 18990,
  
  // Tecnología
  'audifonos': 24990,
  'camaras': 19990,
  'celular': 29990,
  
  // Juguetes
  'carpas': 12990,
  'juegos': 8990,
  'libreria': 6990,
  
  // Cuidado Personal
  'maquinaafeitar': 15990,
  'relajación': 11990
}

function cleanProductName(folderName: string): string {
  return folderName
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Separar camelCase
    .replace(/([0-9]+)([a-z])/gi, '$1 $2') // Separar números
    .replace(/[,\/]/g, ' ') // Reemplazar comas y barras
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getPrice(subcategory: string): number {
  return PRICE_MAP[subcategory.toLowerCase()] || 14990
}

function scanProductFolders(basePath: string, categorySlug: string): ProductToCreate[] {
  const products: ProductToCreate[] = []
  
  if (!fs.existsSync(basePath)) {
    console.log(`⚠️  Carpeta no encontrada: ${basePath}`)
    return products
  }

  const subcategories = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())

  for (const subcategory of subcategories) {
    const subcategoryPath = path.join(basePath, subcategory.name)
    const productFolders = fs.readdirSync(subcategoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    for (const productFolder of productFolders) {
      const productPath = path.join(subcategoryPath, productFolder.name)
      const imageFiles = fs.readdirSync(productPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

      if (imageFiles.length > 0) {
        const productName = cleanProductName(productFolder.name)
        const images = imageFiles.map(img => 
          `/images/${categorySlug}/${subcategory.name}/${productFolder.name}/${img}`
        )

        products.push({
          name: productName,
          slug: generateSlug(productName),
          description: `${productName} - Producto de calidad de IZA&CAS`,
          price: getPrice(subcategory.name),
          stock: Math.floor(Math.random() * 30) + 5, // Stock entre 5 y 35
          images,
          categorySlug: CATEGORY_MAP[categorySlug] || categorySlug,
          isActive: true
        })
      }
    }
  }

  return products
}

/**
 * Genera un código SKU único basado en la categoría y un número secuencial
 */
function generateSKU(categorySlug: string, sequence: number): string {
  const categoryCode = categorySlug.substring(0, 5).toUpperCase();
  const seqNumber = sequence.toString().padStart(3, '0');
  return `SKU-${categoryCode}-${seqNumber}`;
}

async function main() {
  console.log('🚀 Iniciando carga de productos de TODAS las categorías...\n')

  const publicPath = path.join(process.cwd(), 'public', 'images')
  const allProducts: ProductToCreate[] = []

  // Escanear todas las categorías
  const categories = ['actividad', 'cuidadopersonal', 'electro hogar', 'herramientas', 'hogar', 'juguetes', 'tecnologia']

  for (const category of categories) {
    console.log(`📦 Escaneando categoría: ${category}`)
    const categoryPath = path.join(publicPath, category)
    const products = scanProductFolders(categoryPath, category)
    allProducts.push(...products)
    console.log(`   ✅ Encontrados ${products.length} productos\n`)
  }

  console.log(`\n📊 Total de productos encontrados: ${allProducts.length}\n`)
  console.log('💾 Cargando productos a la base de datos...\n')

  let created = 0
  let updated = 0
  let errors = 0
  const skuCounters: { [key: string]: number } = {}

  for (const product of allProducts) {
    try {
      // Buscar la categoría
      const category = await prisma.category.findUnique({
        where: { slug: product.categorySlug }
      })

      if (!category) {
        console.log(`⚠️  Categoría no encontrada: ${product.categorySlug} para ${product.name}`)
        errors++
        continue
      }

      // Inicializar contador de SKU para esta categoría
      if (!skuCounters[product.categorySlug]) {
        skuCounters[product.categorySlug] = 1
      }

      // Verificar si el producto ya existe
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      })

      if (existing) {
        // Actualizar producto existente
        await prisma.product.update({
          where: { slug: product.slug },
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
            isActive: product.isActive
          }
        })
        updated++
      } else {
        // Generar SKU único para nuevo producto
        let skuGenerated = false
        let attempts = 0
        
        while (!skuGenerated && attempts < 10) {
          const sku = generateSKU(product.categorySlug, skuCounters[product.categorySlug])
          
          try {
            // Crear nuevo producto
            await prisma.product.create({
              data: {
                name: product.name,
                slug: product.slug,
                sku: sku,
                description: product.description,
                price: product.price,
                stock: product.stock,
                images: product.images,
                categoryId: category.id,
                isActive: product.isActive
              }
            })
            created++
            skuGenerated = true
            skuCounters[product.categorySlug]++
          } catch (error: any) {
            if (error.code === 'P2002') {
              // SKU duplicado, incrementar contador y reintentar
              skuCounters[product.categorySlug]++
              attempts++
            } else {
              throw error
            }
          }
        }
        
        if (!skuGenerated) {
          console.log(`❌ No se pudo generar SKU único para ${product.name}`)
          errors++
        }
      }

      // Mostrar progreso cada 10 productos
      if ((created + updated) % 10 === 0) {
        console.log(`   Procesados: ${created + updated}/${allProducts.length}`)
      }

    } catch (error: any) {
      console.error(`❌ Error con producto ${product.name}:`, error.message)
      errors++
    }
  }

  console.log('\n✅ Carga de productos completada!')
  console.log(`   📦 Productos creados: ${created}`)
  console.log(`   🔄 Productos actualizados: ${updated}`)
  console.log(`   ❌ Errores: ${errors}`)
  
  // Mostrar resumen por categoría
  console.log('\n📊 Resumen por categoría:')
  const categoryCounts = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  for (const cat of categoryCounts) {
    console.log(`   ${cat.name}: ${cat._count.products} productos`)
  }
}

main()
  .catch((e) => {
    console.error('Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
