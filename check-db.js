const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const productCount = await prisma.product.count()
  const categoryCount = await prisma.category.count()
  
  console.log('📊 Estado de la base de datos "iza&cas":')
  console.log('  ├─ Categorías:', categoryCount)
  console.log('  └─ Productos:', productCount)
  
  if (productCount > 0) {
    const products = await prisma.product.findMany({ take: 5 })
    console.log('\n🛍️ Primeros 5 productos:')
    products.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.name} - $${p.price}`)
    })
  }
}

main()
  .finally(() => prisma.$disconnect())
