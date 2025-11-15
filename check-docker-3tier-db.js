const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function main() {
  const products = await prisma.product.count()
  const categories = await prisma.category.count()
  const banners = await prisma.banner.count()
  const users = await prisma.user.count()
  
  console.log('📊 Base de datos Docker (3-tier en puerto 5434):')
  console.log(`   Categorías: ${categories}`)
  console.log(`   Productos: ${products}`)
  console.log(`   Banners: ${banners}`)
  console.log(`   Usuarios: ${users}`)
  
  if (products > 0) {
    console.log('\n✅ La base de datos Docker tiene datos!')
    console.log('   Frontend y Backend deberían mostrar los productos.')
  } else {
    console.log('\n❌ La base de datos Docker está vacía!')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
