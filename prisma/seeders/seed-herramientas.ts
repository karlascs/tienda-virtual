/**
 * Seeder de productos de Herramientas - IZA&CAS
 * Migra productos de la categoría herramientas desde src/app/products/herramientas/page.tsx
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Función para extraer características de herramientas
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  const patterns = [
    { regex: /(\d+)\s*metros/i, template: (match: string) => `${match} metros` },
    { regex: /(\d+)\s*voltios/i, template: (match: string) => `${match}V` },
    { regex: /(\d+)\s*W/i, template: (match: string) => `${match}W de potencia` },
    { regex: /(\d+)\s*LED/i, template: (match: string) => `${match} LED` },
    { regex: /recargable/i, template: () => 'Recargable' },
    { regex: /inalámbric/i, template: () => 'Inalámbrico' },
    { regex: /resistente/i, template: () => 'Resistente' },
    { regex: /portátil/i, template: () => 'Portátil' },
    { regex: /impermeable/i, template: () => 'Impermeable' },
    { regex: /automático/i, template: () => 'Automático' },
    { regex: /profesional/i, template: () => 'Profesional' },
    { regex: /alta calidad/i, template: () => 'Alta calidad' },
    { regex: /multifuncional/i, template: () => 'Multifuncional' },
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
  
  return features.length > 0 ? features : ['Herramienta de calidad']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['RAF', 'Ocean', 'Air Power', 'Professional', 'Power']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

async function main() {
  console.log('🔧 Migrando productos de Herramientas...')

  try {
    // Verificar que la categoría existe
    const herramientasCategory = await prisma.category.findUnique({
      where: { slug: 'herramientas' }
    })

    if (!herramientasCategory) {
      console.error('❌ Categoría "herramientas" no encontrada')
      return
    }

    // Leer el archivo de productos de herramientas
    const filePath = path.join(process.cwd(), 'src/app/products/herramientas/page.tsx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Extraer las líneas del array (líneas 22 a 196)
    const lines = content.split('\n')
    const arrayLines = lines.slice(21, 196) // línea 22 es índice 21
    const arrayContent = arrayLines.join('\n')
    
    console.log('📄 Array encontrado desde línea 22 hasta 196')
    
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
        where: { categoryId: herramientasCategory.id }
      })
      const categoryCode = herramientasCategory.slug.substring(0, 5).toUpperCase()
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
            stock: Math.floor(Math.random() * 15) + 5, // Stock entre 5-20
            isFeatured: Math.random() > 0.85, // 15% productos destacados
            categoryId: herramientasCategory.id,
          },
        })

        console.log(`✅ ${products.indexOf(product) + 1}. ${createdProduct.name} (Slug: ${createdProduct.slug})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`🎉 ${products.length} productos de herramientas migrados exitosamente!`)

  } catch (error) {
    console.error('❌ Error durante la migración de herramientas:', error)
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