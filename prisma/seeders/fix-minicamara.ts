/**
 * Script para corregir manualmente el producto de minicámara
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      name: { contains: 'Mini' }
    }
  })
  
  if (!product) {
    console.log('❌ Producto no encontrado')
    return
  }
  
  console.log('📷 Producto encontrado:', product.name)
  console.log('Imágenes actuales:')
  product.images.forEach((img: string) => console.log(`  - ${img}`))
  
  const newImages = product.images.map((img: string) => 
    img.replace('minicamaraespiahd', 'minicamarapiahd')
  )
  
  await prisma.product.update({
    where: { id: product.id },
    data: { images: newImages }
  })
  
  console.log('\n✅ Imágenes actualizadas:')
  newImages.forEach((img: string) => console.log(`  - ${img}`))
  
  await prisma.$disconnect()
}

main()
