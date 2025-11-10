/**
 * Seeder de productos de Hogar - IZA&CAS
 * Migra productos de la categoría hogar desde src/data/products.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Función para extraer características de hogar
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  const patterns = [
    { regex: /(\d+)\s*tazas/i, template: (match: string) => `${match} tazas` },
    { regex: /(\d+)\s*plazas/i, template: (match: string) => `${match} plazas` },
    { regex: /(\d+)\s*cm/i, template: (match: string) => `${match}cm` },
    { regex: /(\d+)\s*fuente/i, template: (match: string) => `${match} fuente` },
    { regex: /acero inoxidable/i, template: () => 'Acero inoxidable' },
    { regex: /eléctric/i, template: () => 'Eléctrico' },
    { regex: /alta potencia/i, template: () => 'Alta potencia' },
    { regex: /múltiples velocidades/i, template: () => 'Múltiples velocidades' },
    { regex: /resistente/i, template: () => 'Resistente' },
    { regex: /compacto/i, template: () => 'Compacto' },
    { regex: /moderno/i, template: () => 'Diseño moderno' },
    { regex: /suave/i, template: () => 'Suave' },
    { regex: /abrigador/i, template: () => 'Abrigador' },
    { regex: /cálido/i, template: () => 'Cálido' },
    { regex: /cómodo/i, template: () => 'Cómodo' },
    { regex: /elegante/i, template: () => 'Elegante' },
    { regex: /peludo/i, template: () => 'Peludo' },
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
  
  return features.length > 0 ? features : ['Producto para el hogar']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['RAF', 'Ocean', 'MIXER', 'Chiporro', 'Home']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

async function main() {
  console.log('🏠 Migrando productos de Hogar...')

  try {
    // Verificar que la categoría existe
    const hogarCategory = await prisma.category.findUnique({
      where: { slug: 'hogar' }
    })

    if (!hogarCategory) {
      console.error('❌ Categoría "hogar" no encontrada')
      return
    }

    // Leer el archivo de productos
    const filePath = path.join(process.cwd(), 'src/data/products.ts')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Extraer las líneas del array HOGAR_PRODUCTS_DATA (líneas 19 a 133)
    const lines = content.split('\n')
    const arrayLines = lines.slice(18, 133) // línea 19 es índice 18
    const arrayContent = arrayLines.join('\n')
    
    console.log('📄 Array encontrado desde línea 19 hasta 133')
    
    // Regex para extraer productos individuales
    const productRegex = /{\s*id:\s*(\d+),\s*name:\s*["']([^"']+)["'],\s*price:\s*(\d+),\s*images:\s*\[([\s\S]*?)\],\s*description:\s*["']([^"']+)["'],\s*category:\s*["']([^"']+)["']\s*}/g
    
    let match
    const products = []
    
    while ((match = productRegex.exec(arrayContent)) !== null) {
      const [, id, name, price, imagesStr, description, category] = match
      
      // Extraer imágenes del array
      const imageMatches = imagesStr.match(/["']([^"']+)["']/g) || []
      const images = imageMatches.map(img => img.replace(/["']/g, ''))
      
      products.push({
        id: parseInt(id),
        name: name.trim(),
        price: parseInt(price),
        image: images[0] || '',
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
        where: { categoryId: hogarCategory.id }
      })
      const categoryCode = hogarCategory.slug.substring(0, 5).toUpperCase()
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
            stock: Math.floor(Math.random() * 20) + 10, // Stock entre 10-30
            isFeatured: Math.random() > 0.75, // 25% productos destacados
            categoryId: hogarCategory.id,
          },
        })

        console.log(`✅ ${products.indexOf(product) + 1}. ${createdProduct.name} (Slug: ${createdProduct.slug})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`🎉 ${products.length} productos de hogar migrados exitosamente!`)

  } catch (error) {
    console.error('❌ Error durante la migración de hogar:', error)
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