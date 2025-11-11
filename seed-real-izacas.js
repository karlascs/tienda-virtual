const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Mapeo de carpetas a categorías
const CATEGORY_MAP = {
  'actividad': 'actividad',
  'cuidadopersonal': 'cuidado-personal',
  'electro hogar': 'electrohogar',
  'herramientas': 'herramientas',
  'hogar': 'hogar',
  'juguetes': 'juguetes',
  'tecnologia': 'tecnologia'
}

// Precios por subcategoría
const PRICE_MAP = {
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
  'alfombras': 18990,
  'alfomfrapeluda150': 18990,
  'ropa de cama': 32990,
  
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

function cleanProductName(folderName) {
  return folderName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([0-9]+)([a-z])/gi, '$1 $2')
    .replace(/[,\/]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getPrice(subcategory) {
  return PRICE_MAP[subcategory.toLowerCase()] || 14990
}

function scanProductFolders(basePath, categorySlug) {
  const products = []
  
  if (!fs.existsSync(basePath)) {
    console.log(`⚠️  Carpeta no encontrada: ${basePath}`)
    return products
  }

  const subcategories = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))

  for (const subcategory of subcategories) {
    const subcategoryPath = path.join(basePath, subcategory.name)
    
    const productFolders = fs.readdirSync(subcategoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))

    for (const productFolder of productFolders) {
      const productPath = path.join(subcategoryPath, productFolder.name)
      
      // Buscar todas las imágenes en la carpeta del producto
      const imageFiles = fs.readdirSync(productPath, { withFileTypes: true })
        .filter(file => file.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
        .map(file => `/images/${path.relative('public/images', path.join(productPath, file.name)).replace(/\\/g, '/')}`)

      if (imageFiles.length === 0) continue

      const productName = cleanProductName(productFolder.name)
      const slug = generateSlug(productName)
      const price = getPrice(subcategory.name)

      products.push({
        name: productName,
        slug: slug,
        description: `${productName} de alta calidad. Producto disponible en IZA&CAS.`,
        price: price,
        stock: 10,
        images: imageFiles,
        categorySlug: categorySlug,
        isActive: true
      })
    }
  }

  return products
}

function generateSKU(categorySlug, counter) {
  const prefix = categorySlug.substring(0, 3).toUpperCase()
  return `${prefix}-${String(counter).padStart(4, '0')}`
}

async function main() {
  console.log('🌱 Cargando productos REALES de IZA&CAS desde las imágenes...\n')

  const imagesBasePath = '/app/public/images'
  let allProducts = []

  // Escanear cada categoría
  for (const [folderName, categorySlug] of Object.entries(CATEGORY_MAP)) {
    const categoryPath = path.join(imagesBasePath, folderName)
    console.log(`📁 Escaneando: ${folderName}`)
    
    const products = scanProductFolders(categoryPath, categorySlug)
    console.log(`   Encontrados: ${products.length} productos`)
    
    allProducts = allProducts.concat(products)
  }

  console.log(`\n📦 Total de productos encontrados: ${allProducts.length}\n`)

  // Limpiar productos existentes
  console.log('🧹 Limpiando productos anteriores...')
  await prisma.product.deleteMany()
  console.log('✅ Productos limpiados\n')

  console.log('💾 Insertando productos REALES del cliente...')
  
  let created = 0
  let errors = 0
  const skuCounters = {}

  for (const product of allProducts) {
    try {
      // Buscar categoría
      const category = await prisma.category.findUnique({
        where: { slug: product.categorySlug }
      })

      if (!category) {
        console.log(`⚠️  Categoría no encontrada: ${product.categorySlug}`)
        continue
      }

      // Inicializar contador SKU
      if (!skuCounters[product.categorySlug]) {
        skuCounters[product.categorySlug] = 1
      }

      let skuGenerated = false
      let attempts = 0
      
      while (!skuGenerated && attempts < 10) {
        const sku = generateSKU(product.categorySlug, skuCounters[product.categorySlug])
        
        try {
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
              isActive: product.isActive,
              isFeatured: created < 10 // Primeros 10 como destacados
            }
          })
          created++
          skuGenerated = true
          skuCounters[product.categorySlug]++
          
          if (created % 10 === 0) {
            console.log(`   Procesados: ${created}/${allProducts.length}`)
          }
        } catch (error) {
          if (error.code === 'P2002') {
            skuCounters[product.categorySlug]++
            attempts++
          } else {
            throw error
          }
        }
      }
      
      if (!skuGenerated) {
        console.log(`❌ No se pudo crear: ${product.name}`)
        errors++
      }

    } catch (error) {
      console.error(`❌ Error con ${product.name}:`, error.message)
      errors++
    }
  }

  console.log('\n✅ Carga de productos REALES completada!')
  console.log(`   📦 Productos creados: ${created}`)
  console.log(`   ❌ Errores: ${errors}`)
  
  // Resumen por categoría
  console.log('\n📊 Resumen por categoría:')
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  for (const cat of categories) {
    console.log(`   ${cat.name}: ${cat._count.products} productos`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
