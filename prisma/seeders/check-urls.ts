/**
 * Script para ver las URLs de imágenes de tecnología
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tecnologia = await prisma.category.findUnique({
    where: { slug: 'tecnologia' },
    include: { 
      products: {
        take: 5
      }
    }
  })
  
  console.log('\n📱 Productos de Tecnología:\n')
  tecnologia?.products.forEach((p) => {
    console.log(`${p.name}`)
    console.log(`  Imágenes:`)
    p.images.forEach((img: string) => {
      console.log(`    - ${img}`)
    })
    console.log()
  })
  
  await prisma.$disconnect()
}

main()
