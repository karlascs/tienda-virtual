// Script para actualizar slugs de categorías en Railway
// Ejecutar desde Railway CLI: railway run node fix-slugs.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSlugs() {
  try {
    console.log('🔧 Actualizando slugs de categorías...\n');
    
    // Mapeo de nombres a slugs correctos (sin guiones)
    const slugMapping = {
      'Cuidado Personal': 'cuidadopersonal',
      'Electrohogar': 'electrohogar',
      'Herramientas': 'herramientas',
      'Tecnología': 'tecnologia',
      'Actividad': 'actividad',
      'Hogar': 'hogar',
      'Juguetes': 'juguetes'
    };
    
    for (const [name, correctSlug] of Object.entries(slugMapping)) {
      const category = await prisma.category.findFirst({
        where: {
          OR: [
            { name: name },
            { name: { equals: name, mode: 'insensitive' } }
          ]
        }
      });
      
      if (category) {
        if (category.slug !== correctSlug) {
          await prisma.category.update({
            where: { id: category.id },
            data: { slug: correctSlug }
          });
          console.log(`✅ Actualizado: "${category.name}" → slug: "${category.slug}" → "${correctSlug}"`);
        } else {
          console.log(`✓ OK: "${category.name}" → slug: "${category.slug}"`);
        }
      } else {
        console.log(`⚠️  No encontrada: "${name}"`);
      }
    }
    
    console.log('\n✅ Slugs actualizados correctamente');
    
    // Mostrar resultado final
    console.log('\n📊 Categorías finales:');
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: "${cat.slug}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSlugs();
