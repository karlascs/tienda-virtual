/**
 * Seeder de productos de Cuidado Personal - IZA&CAS
 * Migra productos de la categoría cuidado personal desde src/app/products/cuidadopersonal/page.tsx
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Función para extraer características de cuidado personal
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  const patterns = [
    { regex: /(\d+)\s*en\s*1/i, template: (match: string) => `${match} en 1` },
    { regex: /(\d+)\s*hojas/i, template: (match: string) => `${match} hojas` },
    { regex: /(\d+)\s*mm/i, template: (match: string) => `${match}mm` },
    { regex: /recargable/i, template: () => 'Recargable' },
    { regex: /eléctric/i, template: () => 'Eléctrico' },
    { regex: /USB/i, template: () => 'Carga USB' },
    { regex: /inalámbric/i, template: () => 'Inalámbrico' },
    { regex: /portátil/i, template: () => 'Portátil' },
    { regex: /profesional/i, template: () => 'Profesional' },
    { regex: /masaje/i, template: () => 'Masaje' },
    { regex: /relajación/i, template: () => 'Relajación' },
    { regex: /terapéutic/i, template: () => 'Terapéutico' },
    { regex: /precisión/i, template: () => 'Alta precisión' },
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
  
  return features.length > 0 ? features : ['Cuidado personal']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['Professional', 'Care', 'Beauty', 'Relax', 'Wellness']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

async function main() {
  console.log('💄 Migrando productos de Cuidado Personal...')

  try {
    // Verificar que la categoría existe
    const cuidadoCategory = await prisma.category.findUnique({
      where: { slug: 'cuidadopersonal' }
    })

    if (!cuidadoCategory) {
      console.error('❌ Categoría "cuidadopersonal" no encontrada')
      return
    }

    // Leer el archivo de productos de cuidado personal
    const filePath = path.join(process.cwd(), 'src/app/products/cuidadopersonal/page.tsx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Extraer las líneas del array (líneas 22 a 71)
    const lines = content.split('\n')
    const arrayLines = lines.slice(21, 71) // línea 22 es índice 21
    const arrayContent = arrayLines.join('\n')
    
    console.log('📄 Array encontrado desde línea 22 hasta 71')
    
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
        where: { categoryId: cuidadoCategory.id }
      })
      const categoryCode = cuidadoCategory.slug.substring(0, 5).toUpperCase()
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
            stock: Math.floor(Math.random() * 20) + 8, // Stock entre 8-28
            isFeatured: Math.random() > 0.8, // 20% productos destacados
            categoryId: cuidadoCategory.id,
          },
        })

        console.log(`✅ ${products.indexOf(product) + 1}. ${createdProduct.name} (Slug: ${createdProduct.slug})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`🎉 ${products.length} productos de cuidado personal migrados exitosamente!`)

  } catch (error) {
    console.error('❌ Error durante la migración de cuidado personal:', error)
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