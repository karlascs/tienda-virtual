const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function check() {
  const cat = await prisma.category.findFirst({
    where: { name: { contains: 'Cuidado' } }
  })
  console.log('Categoría:', cat.name)
  console.log('Slug:', cat.slug)
  
  const products = await prisma.product.findMany({
    where: {
      categoryId: cat.id,
      isActive: true
    }
  })
  console.log('Productos activos:', products.length)
  
  await prisma.$disconnect()
}

check()
