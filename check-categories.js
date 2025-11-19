const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Verificando categorías en la base de datos...\n');
    
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log(`Total de categorías: ${categories.length}\n`);
    
    categories.forEach(cat => {
      console.log(`ID: ${cat.id}`);
      console.log(`Nombre: ${cat.name}`);
      console.log(`Slug: ${cat.slug}`);
      console.log('---');
    });
    
    // Verificar productos por categoría
    console.log('\nProductos por categoría:\n');
    for (const cat of categories) {
      const count = await prisma.product.count({
        where: { categoryId: cat.id }
      });
      console.log(`${cat.name} (${cat.slug}): ${count} productos`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
