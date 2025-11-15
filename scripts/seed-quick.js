const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * SEEDER RÁPIDO - Solo crea productos de ejemplo para que la app funcione
 * Después puedes cargar más productos manualmente
 */

async function main() {
  console.log('🚀 Seeder rápido iniciando...\n');

  // Verificar categorías
  const categories = await prisma.category.findMany();
  console.log(`✅ Categorías encontradas: ${categories.length}\n`);

  if (categories.length === 0) {
    console.log('❌ No hay categorías. Ejecuta: npx prisma migrate deploy');
    process.exit(1);
  }

  // Productos de ejemplo (uno por categoría)
  const sampleProducts = [
    {
      name: 'Carpa Casita Princesa',
      slug: 'carpa-casita-princesa',
      sku: 'SKU-ACTIV-001',
      description: 'Carpa Casita de Princesa para niñas',
      price: 25990,
      stock: 15,
      images: ['/images/actividad/camping/carpacasitaprincesa/img1.jpg'],
      categorySlug: 'actividad',
    },
    {
      name: 'Compresor de Aire Portátil',
      slug: 'compresor-aire-portatil',
      sku: 'SKU-HERRA-001',
      description: 'Compresor de aire portátil para auto',
      price: 14990,
      stock: 20,
      images: ['/images/herramientas/car/compresordeaireportatil/img1.jpg'],
      categorySlug: 'herramientas',
    },
    {
      name: 'Hervidor Eléctrico',
      slug: 'hervidor-electrico',
      sku: 'SKU-ELECT-001',
      description: 'Hervidor de agua eléctrico',
      price: 12990,
      stock: 25,
      images: ['/images/electro hogar/hervidores/img1.jpg'],
      categorySlug: 'electrohogar',
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const prod of sampleProducts) {
    try {
      const category = categories.find(c => c.slug === prod.categorySlug);
      if (!category) {
        console.log(`⚠️  Categoría no encontrada: ${prod.categorySlug}`);
        skipped++;
        continue;
      }

      const existing = await prisma.product.findUnique({
        where: { slug: prod.slug }
      });

      if (existing) {
        console.log(`⏭️  Ya existe: ${prod.name}`);
        skipped++;
        continue;
      }

      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          images: prod.images,
          categoryId: category.id,
          isActive: true,
          averageRating: 0,
          totalReviews: 0,
        }
      });

      console.log(`✅ Creado: ${prod.name}`);
      created++;
    } catch (error) {
      console.error(`❌ Error con ${prod.name}:`, error.message);
    }
  }

  console.log(`\n✅ Seeder completado!`);
  console.log(`   Productos creados: ${created}`);
  console.log(`   Productos saltados: ${skipped}`);
  console.log(`\n💡 Para cargar TODOS los productos, ejecuta:`);
  console.log(`   node scripts/seed-railway-complete.js\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
