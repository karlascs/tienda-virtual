// Script simple para Railway - ejecutar con: railway run node fix-railway-quick.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  console.log('🔍 Categorías actuales:');
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  cats.forEach(c => console.log(`  ${c.name} → slug: ${c.slug}`));
  
  console.log('\n🔧 Buscando Cuidado Personal...');
  const cp = await prisma.category.findFirst({
    where: { name: { contains: 'Cuidado', mode: 'insensitive' } }
  });
  
  if (cp && cp.slug !== 'cuidadopersonal') {
    console.log(`Actualizando "${cp.slug}" → "cuidadopersonal"`);
    await prisma.category.update({
      where: { id: cp.id },
      data: { slug: 'cuidadopersonal' }
    });
    console.log('✅ Actualizado');
  } else if (!cp) {
    console.log('Creando categoría...');
    await prisma.category.create({
      data: {
        name: 'Cuidado Personal',
        slug: 'cuidadopersonal',
        description: 'Productos de cuidado personal',
        image: '/images/categorias/cuidado-personal.png'
      }
    });
    console.log('✅ Creada');
  } else {
    console.log('✅ Ya está correcta');
  }
  
  await prisma.$disconnect();
}

fix().catch(console.error);
