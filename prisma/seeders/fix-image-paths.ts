/**
 * Script para corregir las rutas de imágenes en la base de datos
 * Lee los archivos reales del disco y actualiza la BD
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Corrigiendo rutas de imágenes...\n')

  const publicPath = path.join(process.cwd(), 'public')
  const products = await prisma.product.findMany({
    include: {
      category: true
    }
  })
  
  let updated = 0
  let errors = 0
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) continue
    
    const firstImage = product.images[0]
    const parts = firstImage.split('/')
    
    if (parts.length < 5) continue
    
    const categorySlug = parts[2]  // tecnologia
    const subcategory = parts[3]   // camaras
    const productFolder = parts[4] // carpeta del producto
    
    // Construir ruta a la carpeta del producto
    const folderPath = path.join(publicPath, 'images', categorySlug, subcategory, productFolder)
    
    // Verificar si existe la carpeta
    if (!fs.existsSync(folderPath)) {
      console.log(`❌ Carpeta no existe: ${productFolder}`)
      errors++
      continue
    }
    
    // Leer archivos reales en la carpeta
    try {
      const files = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .sort()
      
      if (files.length === 0) {
        console.log(`⚠️  Sin imágenes en carpeta: ${productFolder}`)
        continue
      }
      
      // Construir nuevas rutas
      const newImages = files.map(file => 
        `/images/${categorySlug}/${subcategory}/${productFolder}/${file}`
      )
      
      // Solo actualizar si hay diferencias
      const currentImages = product.images.slice().sort()
      const newImagesSorted = newImages.slice().sort()
      
      if (JSON.stringify(currentImages) !== JSON.stringify(newImagesSorted)) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: newImages }
        })
        
        updated++
        console.log(`✅ ${product.name}`)
        console.log(`   Carpeta: ${productFolder}`)
        console.log(`   Antes: ${product.images.length} imágenes`)
        console.log(`   Ahora: ${newImages.length} imágenes`)
        console.log()
      }
    } catch (error) {
      console.error(`❌ Error procesando ${product.name}:`, error)
      errors++
    }
  }
  
  console.log(`\n🎉 ${updated} productos actualizados`)
  if (errors > 0) {
    console.log(`⚠️  ${errors} errores encontrados`)
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)
