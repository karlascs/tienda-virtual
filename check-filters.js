const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function checkFilters() {
  console.log('🔍 Verificando filtros de productos...\n')
  
  // Productos destacados
  const featured = await prisma.product.count({
    where: { isFeatured: true, isActive: true }
  })
  
  // Por categoría
  const byCategory = await prisma.product.groupBy({
    by: ['categoryId'],
    where: { isActive: true },
    _count: { id: true }
  })
  
  console.log(`📊 Productos destacados activos: ${featured}`)
  console.log(`\n📦 Productos activos por categoría:`)
  
  for (const group of byCategory) {
    const category = await prisma.category.findUnique({
      where: { id: group.categoryId }
    })
    console.log(`   ${category.name}: ${group._count.id} productos`)
  }
  
  // Verificar productos inactivos
  const inactive = await prisma.product.count({
    where: { isActive: false }
  })
  console.log(`\n⚠️  Productos inactivos: ${inactive}`)
  
  // Verificar productos sin stock
  const noStock = await prisma.product.count({
    where: { stock: 0, isActive: true }
  })
  console.log(`⚠️  Productos sin stock (activos): ${noStock}`)
}

checkFilters()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
