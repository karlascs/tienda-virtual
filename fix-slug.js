const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin123@localhost:5434/iza&cas'
    }
  }
})

async function fixSlug() {
  console.log('🔧 Actualizando slug de Cuidado Personal...')
  
  const updated = await prisma.category.updateMany({
    where: {
      name: 'Cuidado Personal'
    },
    data: {
      slug: 'cuidadopersonal'
    }
  })
  
  console.log(`✅ Actualizado: ${updated.count} categoría(s)`)
  
  // Verificar
  const cat = await prisma.category.findFirst({
    where: { name: 'Cuidado Personal' }
  })
  
  console.log(`Nuevo slug: ${cat.slug}`)
  
  await prisma.$disconnect()
}

fixSlug().catch(console.error)
