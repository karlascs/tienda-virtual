/**
 * Seeder para productos de Electrohogar
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔌 Migrando productos de Electrohogar...')

  try {
    // Leer el archivo de electrohogar
    const filePath = path.join(process.cwd(), 'src/app/products/electrohogar/page.tsx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Encontrar la línea donde inicia el array
    const lines = content.split('\n')
    let startLine = -1
    let endLine = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('ELECTRO_HOGAR_PRODUCTS: Product[] = [')) {
        startLine = i + 1
      }
      if (startLine !== -1 && lines[i].trim() === '];') {
        endLine = i
        break
      }
    }
    
    if (startLine === -1 || endLine === -1) {
      throw new Error('No se pudo encontrar el array de productos')
    }
    
    console.log(`📄 Array encontrado desde línea ${startLine + 1} hasta ${endLine + 1}`)
    
    // Extraer el contenido del array
    const arrayContent = lines.slice(startLine, endLine).join('\n')
    
    // Parsear productos usando regex
    const productMatches = arrayContent.match(/\{[\s\S]*?\},?(?=\s*\{|\s*$)/g)
    
    if (!productMatches) {
      throw new Error('No se encontraron productos en el archivo')
    }
    
    console.log(`🔍 ${productMatches.length} productos encontrados`)
    
    // Encontrar la categoría electrohogar
    const category = await prisma.category.findUnique({
      where: { slug: 'electrohogar' }
    })
    
    if (!category) {
      throw new Error('Categoría electrohogar no encontrada')
    }
    
    let productCount = 0
    
    for (const productMatch of productMatches) {
      try {
        // Extraer campos usando regex
        const idMatch = productMatch.match(/id:\s*(\d+)/)
        const nameMatch = productMatch.match(/name:\s*["']([^"']+)["']/)
        const priceMatch = productMatch.match(/price:\s*(\d+)/)
        const descriptionMatch = productMatch.match(/description:\s*["']([^"']*?)["']/)
        const imageMatch = productMatch.match(/image:\s*["']([^"']+)["']/)
        
        // Extraer array de imágenes
        const imagesMatch = productMatch.match(/images:\s*\[([\s\S]*?)\]/)
        let images: string[] = []
        
        if (imagesMatch) {
          const imagesList = imagesMatch[1].match(/["']([^"']+)["']/g)
          if (imagesList) {
            images = imagesList.map(img => img.replace(/["']/g, ''))
          }
        } else if (imageMatch) {
          images = [imageMatch[1]]
        }
        
        if (!idMatch || !nameMatch || !priceMatch || !descriptionMatch) {
          console.warn('❌ Producto incompleto:', { idMatch, nameMatch, priceMatch, descriptionMatch })
          continue
        }
        
        const productId = parseInt(idMatch[1])
        const name = nameMatch[1]
        const price = parseInt(priceMatch[1])
        const description = descriptionMatch[1]
        
        // Verificar si el producto ya existe por slug
        const baseSlug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        const existingProduct = await prisma.product.findUnique({
          where: { slug: baseSlug }
        })
        
        if (existingProduct) {
          console.log(`⚠️  Producto "${name}" ya existe, saltando...`)
          continue
        }
        
        // Generar slug único
        let slug = baseSlug
        let counter = 1
        
        while (await prisma.product.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
        
        // Extraer características y marca
        const features = extractFeatures(name, description)
        const brand = extractBrand(name)
        
        // Generar SKU único
        const existingCount = await prisma.product.count({
          where: { categoryId: category.id }
        })
        const categoryCode = category.slug.substring(0, 5).toUpperCase()
        const sku = `SKU-${categoryCode}-${String(existingCount + 1).padStart(3, '0')}`
        
        // Crear producto
        const createdProduct = await prisma.product.create({
          data: {
            name,
            slug,
            sku,
            description,
            price,
            brand,
            features,
            images,
            stock: Math.floor(Math.random() * 20) + 5,
            isFeatured: Math.random() > 0.85,
            categoryId: category.id,
          },
        })
        
        productCount++
        console.log(`✅ ${productCount}. ${createdProduct.name} (Slug: ${slug})`)
        
      } catch (error) {
        console.error('❌ Error procesando producto:', error)
      }
    }
    
    console.log(`🎉 ${productCount} productos de electrohogar migrados exitosamente!`)
    
  } catch (error) {
    console.error('❌ Error durante la migración de electrohogar:', error)
    throw error
  }
}

// Función para extraer características
function extractFeatures(name: string, description: string): string[] {
  const features: string[] = []
  const text = `${name} ${description}`.toLowerCase()
  
  const patterns = [
    { regex: /(\d+)\s*ml/i, template: (match: string) => `${match}ml de capacidad` },
    { regex: /(\d+)\s*L/i, template: (match: string) => `${match}L de capacidad` },
    { regex: /(\d+)\s*tazas/i, template: (match: string) => `${match} tazas` },
    { regex: /eléctric/i, template: () => 'Eléctrico' },
    { regex: /acero inoxidable/i, template: () => 'Acero inoxidable' },
    { regex: /antiadherente/i, template: () => 'Antiadherente' },
    { regex: /automático/i, template: () => 'Automático' },
    { regex: /digital/i, template: () => 'Display digital' },
    { regex: /led/i, template: () => 'Tecnología LED' },
    { regex: /portátil/i, template: () => 'Portátil' },
    { regex: /multifuncional/i, template: () => 'Multifuncional' },
    { regex: /raf/i, template: () => 'Marca RAF' },
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern.regex)
    if (match) {
      const feature = pattern.template(match[1] || match[0])
      if (!features.includes(feature)) {
        features.push(feature)
      }
    }
  }
  
  return features.length > 0 ? features : ['Electrodoméstico de calidad']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['RAF', 'Ocean', 'MIXER', 'Air Power']
  for (const brand of brands) {
    if (name.toUpperCase().includes(brand.toUpperCase())) return brand
  }
  return 'IZA&CAS'
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