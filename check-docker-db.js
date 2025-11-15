const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://izacas_user:izacas123@localhost:5432/iza%26cas'
    }
  }
})

async function main() {
  const products = await prisma.product.count()
  const categories = await prisma.category.count()
  const banners = await prisma.banner.count()
  
  console.log('📊 Base de datos local (la que usa Docker):')
  console.log(`   Categorías: ${categories}`)
  console.log(`   Productos: ${products}`)
  console.log(`   Banners: ${banners}`)
  
  if (products > 0) {
    console.log('\n✅ La base de datos tiene datos!')
    console.log('   Docker debería mostrar los productos.')
  } else {
    console.log('\n❌ La base de datos está vacía!')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
