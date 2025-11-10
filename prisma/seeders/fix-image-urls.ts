/**
 * Script para decodificar URLs de imágenes en la base de datos
 * Convierte %3D a =, %2B a +, etc.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Corrigiendo URLs de imágenes...')

  try {
    // Obtener todos los productos
    const products = await prisma.product.findMany()
    
    let updated = 0
    
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        // Decodificar cada URL de imagen
        const decodedImages = product.images.map((img: string) => {
          try {
            return decodeURIComponent(img)
          } catch (error) {
            console.warn(`⚠️  No se pudo decodificar: ${img}`)
            return img
          }
        })
        
        // Verificar si alguna imagen cambió
        const hasChanges = decodedImages.some((decoded, index) => decoded !== product.images[index])
        
        if (hasChanges) {
          await prisma.product.update({
            where: { id: product.id },
            data: { images: decodedImages }
          })
          
          updated++
          console.log(`✅ ${product.name}`)
          console.log(`   Antes: ${product.images[0]}`)
          console.log(`   Después: ${decodedImages[0]}`)
        }
      }
    }
    
    console.log(`\n🎉 ${updated} productos actualizados de ${products.length} totales`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
