import { prisma } from '../src/lib/prisma'

async function checkProducts() {
  try {
    console.log('📊 Verificando productos por categoría...\n')

    // Obtener todas las categorías
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('=== CATEGORÍAS ===')
    for (const cat of categories) {
      console.log(`${cat.name} (${cat.slug}): ${cat._count.products} productos`)
    }

    // Total de productos
    const totalProducts = await prisma.product.count()
    const activeProducts = await prisma.product.count({ where: { isActive: true } })
    
    console.log('\n=== TOTALES ===')
    console.log(`Total de productos: ${totalProducts}`)
    console.log(`Productos activos: ${activeProducts}`)
    console.log(`Productos inactivos: ${totalProducts - activeProducts}`)

    // Ver algunos productos de ejemplo
    console.log('\n=== MUESTRA DE PRODUCTOS ===')
    const sampleProducts = await prisma.product.findMany({
      take: 10,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })

    for (const prod of sampleProducts) {
      console.log(`- ${prod.name} [${prod.category.name}] - Stock: ${prod.stock} - Activo: ${prod.isActive}`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
