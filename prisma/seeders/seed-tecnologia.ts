/**
 * Seeder de productos de Tecnología - IZA&CAS
 * Migra productos de la categoría tecnología desde src/app/products/tecnologia/page.tsx
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Función para extraer características de tecnología
function extractFeatures(product: any): string[] {
  const features: string[] = []
  const description = product.description || ''
  const name = product.name || ''
  
  const patterns = [
    { regex: /(\d+)\s*mAh/i, template: (match: string) => `${match} mAh` },
    { regex: /(\d+)\s*W/i, template: (match: string) => `${match}W` },
    { regex: /(\d+)\s*V/i, template: (match: string) => `${match}V` },
    { regex: /(\d+)\s*°/i, template: (match: string) => `${match}° rotación` },
    { regex: /360°/i, template: () => '360° rotación' },
    { regex: /HD/i, template: () => 'Alta definición' },
    { regex: /USB/i, template: () => 'Conexión USB' },
    { regex: /Tipo C/i, template: () => 'USB Tipo C' },
    { regex: /inalámbric/i, template: () => 'Inalámbrico' },
    { regex: /Bluetooth/i, template: () => 'Bluetooth' },
    { regex: /WiFi/i, template: () => 'WiFi' },
    { regex: /IP66/i, template: () => 'Resistente al agua IP66' },
    { regex: /recargable/i, template: () => 'Recargable' },
    { regex: /impermeable/i, template: () => 'Impermeable' },
    { regex: /seguridad/i, template: () => 'Sistema de seguridad' },
    { regex: /carga rápida/i, template: () => 'Carga rápida' },
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
  
  return features.length > 0 ? features : ['Tecnología avanzada']
}

// Función para extraer marca
function extractBrand(name: string): string {
  const brands = ['IRM', 'iPhone', 'Apple', 'Samsung', 'Sony', 'LG']
  for (const brand of brands) {
    if (name.includes(brand)) return brand
  }
  return 'IZA&CAS'
}

async function main() {
  console.log('📱 Migrando productos de Tecnología...')

  try {
    // Verificar que la categoría existe
    const tecnologiaCategory = await prisma.category.findUnique({
      where: { slug: 'tecnologia' }
    })

    if (!tecnologiaCategory) {
      console.error('❌ Categoría "tecnologia" no encontrada')
      return
    }

    // Leer el archivo de productos de tecnología
    const filePath = path.join(process.cwd(), 'src/app/products/tecnologia/page.tsx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Extraer las líneas del array (líneas 22 a 120)
    const lines = content.split('\n')
    const arrayLines = lines.slice(21, 120) // línea 22 es índice 21
    const arrayContent = arrayLines.join('\n')
    
    console.log('📄 Array encontrado desde línea 22 hasta 120')
    
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

      // Validar y decodificar imágenes
      const validImages = product.images
        ?.filter((img: string) => img && img.trim() !== '')
        .map((img: string) => decodeURIComponent(img)) || []

      // Generar SKU único
      const productCount = await prisma.product.count({
        where: { categoryId: tecnologiaCategory.id }
      })
      const categoryCode = tecnologiaCategory.slug.substring(0, 5).toUpperCase()
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
            isFeatured: Math.random() > 0.8, // 20% productos destacados para tecnología
            categoryId: tecnologiaCategory.id,
          },
        })

        console.log(`✅ ${products.indexOf(product) + 1}. ${createdProduct.name} (Slug: ${createdProduct.slug})`)
      } catch (error) {
        console.error(`❌ Error creando producto ${product.name}:`, error)
      }
    }

    console.log(`🎉 ${products.length} productos de tecnología migrados exitosamente!`)

  } catch (error) {
    console.error('❌ Error durante la migración de tecnología:', error)
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