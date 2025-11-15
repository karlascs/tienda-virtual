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

async function findMissingImages() {
  console.log('🔍 Buscando productos con imágenes faltantes...\n')
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      images: true,
      category: {
        select: { name: true }
      }
    }
  })
  
  const publicPath = path.join(__dirname, 'public')
  const issues = []
  
  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      issues.push({
        product: product.name,
        category: product.category.name,
        issue: 'Sin imágenes'
      })
      continue
    }
    
    const missingImages = []
    for (const imagePath of product.images) {
      const cleanPath = imagePath.replace(/^\/images\//, '').replace(/^images\//, '')
      const fullPath = path.join(publicPath, 'images', cleanPath)
      
      if (!fs.existsSync(fullPath)) {
        missingImages.push(imagePath)
      }
    }
    
    if (missingImages.length > 0) {
      issues.push({
        product: product.name,
        category: product.category.name,
        issue: `Faltan ${missingImages.length} de ${product.images.length} imágenes`,
        missing: missingImages
      })
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ Todas las imágenes están presentes!')
  } else {
    console.log(`❌ Encontrados ${issues.length} productos con problemas:\n`)
    issues.forEach(item => {
      console.log(`📦 ${item.product} (${item.category})`)
      console.log(`   ${item.issue}`)
      if (item.missing) {
        item.missing.forEach(img => console.log(`   - ${img}`))
      }
      console.log('')
    })
  }
  
  console.log(`\n📊 Resumen:`)
  console.log(`   Total productos: ${products.length}`)
  console.log(`   Con problemas: ${issues.length}`)
  console.log(`   Sin problemas: ${products.length - issues.length}`)
}

findMissingImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
