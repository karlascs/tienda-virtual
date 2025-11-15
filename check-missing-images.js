const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function checkImages() {
  console.log('🔍 Verificando imágenes de productos...\n')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      images: true
    }
  })
  
  const missingImages = []
  const publicPath = path.join(__dirname, 'public')
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      missingImages.push({
        id: product.id,
        name: product.name,
        issue: 'Sin imágenes en la base de datos'
      })
      continue
    }
    
    for (const imagePath of product.images) {
      // Limpiar la ruta (quitar /images/ si está duplicado)
      const cleanPath = imagePath.replace(/^\/images\//, '')
      const fullPath = path.join(publicPath, 'images', cleanPath)
      
      if (!fs.existsSync(fullPath)) {
        missingImages.push({
          id: product.id,
          name: product.name,
          issue: `Imagen no existe: ${imagePath}`,
          path: fullPath
        })
      }
    }
  }
  
  if (missingImages.length === 0) {
    console.log('✅ Todas las imágenes existen!')
  } else {
    console.log(`❌ Encontrados ${missingImages.length} problemas:\n`)
    missingImages.forEach(item => {
      console.log(`📦 ${item.name}`)
      console.log(`   ${item.issue}`)
      console.log('')
    })
  }
  
  console.log(`\n📊 Total productos: ${products.length}`)
  console.log(`❌ Con problemas: ${missingImages.length}`)
  console.log(`✅ Sin problemas: ${products.length - missingImages.length}`)
}

checkImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
