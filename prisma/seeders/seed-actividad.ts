/**
 * Seeder de productos de Actividad - IZA&CAS
 * Migra productos de la categoría actividad desde src/app/products/actividad/page.tsx
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Función para extraer características de actividad
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  const patterns = [
    { regex: /(\d+)\s*x\s*(\d+)/i, template: (match: string) => `Tamaño ${match}` },
    { regex: /(\d+)\s*cm/i, template: (match: string) => `${match}cm` },
    { regex: /(\d+)\s*metros/i, template: (match: string) => `${match} metros` },
    { regex: /(\d+)\s*plazas/i, template: (match: string) => `${match} plazas` },
    { regex: /(\d+)\s*kg/i, template: (match: string) => `${match}kg` },
    { regex: /30X60/i, template: () => 'Zoom 30X60' },
    { regex: /impermeable/i, template: () => 'Impermeable' },
    { regex: /inflable/i, template: () => 'Inflable' },
    { regex: /resistente/i, template: () => 'Resistente' },
    { regex: /multiuso/i, template: () => 'Multiuso' },
    { regex: /portátil/i, template: () => 'Portátil' },
    { regex: /deportivo/i, template: () => 'Deportivo' },
    { regex: /acuático/i, template: () => 'Acuático' },
    { regex: /tobogán/i, template: () => 'Con tobogán' },
    { regex: /prismáticos/i, template: () => 'Prismáticos' },
    { regex: /hamaca/i, template: () => 'Hamaca' },
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
  
  return features.length > 0 ? features : ['Producto para actividades']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['Ocean', 'Air Power', 'Sport', 'Active', 'Pro']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

async function main() {
  console.log('🏃‍♂️ Migrando productos de Actividad...')

  try {
    // Verificar que la categoría existe
    const actividadCategory = await prisma.category.findUnique({
      where: { slug: 'actividad' }
    })

    if (!actividadCategory) {
      console.error('❌ Categoría "actividad" no encontrada')
      return
    }

    // Leer el archivo de productos de actividad
    const filePath = path.join(process.cwd(), 'src/app/products/actividad/page.tsx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Extraer las líneas del array (líneas 22 a 180)
    const lines = content.split('\n')
    const arrayLines = lines.slice(21, 180) // línea 22 es índice 21
    const arrayContent = arrayLines.join('\n')
    
    console.log('📄 Array encontrado desde línea 22 hasta 180')
    
    // Regex para extraer productos individuales
    const productRegex = /{\s*id:\s*(\d+),\s*name:\s*["']([^"']+)["'],\s*price:\s*(\d+),\s*image:\s*["']([^"']+)["'],\s*images:\s*\[([\s\S]*?)\],\s*description:\s*["']([^"']+)["'],\s*category:\s*["']([^"']+)["']\s*}/g
    
    let match
    const products = []
    
    while ((match = productRegex.exec(arrayContent)) !== null) {
      const [, id, name, price, image, imagesStr, description, category] = match
      
      // Extraer imágenes del array
      const imageMatches = imagesStr.match(/["']([^"']+)["']/g) || []
      const images = imageMatches.map(img => img.replace(/["']/g, ''))
      
      products.push({
        id: parseInt(id),
        name: name.trim(),
        price: parseInt(price),
        image: image.trim(),
        images,
        description: description.trim(),
        category: category.trim()
      })
    }
    
    console.log(`🔍 ${products.length} productos encontrados`)
    
    // Crear productos en la base de datos
    for (const product of products) {
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
      // Validar y decodificar imágenes
      const validImages = product.images
        ?.filter((img: string) => img && img.trim() !== '')
        .map((img: string) => decodeURIComponent(img)) || []

      // Generar SKU único
      const productCount = await prisma.product.count({
        where: { categoryId: actividadCategory.id }
      })
      const categoryCode = actividadCategory.slug.substring(0, 5).toUpperCase()
      const sku = `SKU-${categoryCode}-${String(productCount + 1).padStart(3, '0')}`

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
            stock: Math.floor(Math.random() * 25) + 10, // Stock entre 10-35 para actividades
            isFeatured: Math.random() > 0.75, // 25% productos destacados para actividades
            categoryId: actividadCategory.id,
          },
        })

        console.log(`✅ ${products.indexOf(product) + 1}. ${createdProduct.name} (Slug: ${createdProduct.slug})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`🎉 ${products.length} productos de actividad migrados exitosamente!`)

  } catch (error) {
    console.error('❌ Error durante la migración de actividad:', error)
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