const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function checkCategory() {
  console.log('🔍 Verificando categoría Cuidado Personal...\n')
  
  // Buscar la categoría
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { contains: 'Cuidado', mode: 'insensitive' } },
        { name: { contains: 'Personal', mode: 'insensitive' } },
        { slug: { contains: 'cuidado', mode: 'insensitive' } }
      ]
    }
  })
  
  if (!category) {
    console.log('❌ No se encontró la categoría "Cuidado Personal"')
    console.log('\n📋 Categorías disponibles:')
    const allCategories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true }
    })
    allCategories.forEach(cat => {
      console.log(`   - ${cat.name} (slug: ${cat.slug})`)
    })
    return
  }
  
  console.log(`✅ Categoría encontrada: ${category.name} (ID: ${category.id})`)
  
  // Buscar productos de esa categoría
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id
    },
    select: {
      id: true,
      name: true,
      images: true,
      stock: true,
      isActive: true
    }
  })
  
  console.log(`\n📦 Productos en "${category.name}": ${products.length}`)
  
  if (products.length === 0) {
    console.log('\n❌ No hay productos en esta categoría!')
  } else {
    console.log('\nProductos:')
    products.forEach(p => {
      console.log(`   - ${p.name}`)
      console.log(`     Imágenes: ${p.images?.length || 0}`)
      console.log(`     Stock: ${p.stock}`)
      console.log(`     Activo: ${p.isActive}`)
    })
  }
}

checkCategory()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
