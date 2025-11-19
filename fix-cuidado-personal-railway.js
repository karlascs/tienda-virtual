// Script para corregir categoría Cuidado Personal en Railway
// Ejecutar: node fix-cuidado-personal-railway.js

const { PrismaClient } = require('@prisma/client');

// Usar la DATABASE_URL de Railway (cámbiala por la tuya)
const DATABASE_URL = process.env.DATABASE_URL_RAILWAY || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: No se encontró DATABASE_URL');
  console.log('');
  console.log('Ejecuta el script así:');
  console.log('DATABASE_URL_RAILWAY="postgresql://..." node fix-cuidado-personal-railway.js');
  console.log('');
  console.log('O agrega DATABASE_URL_RAILWAY a tu archivo .env');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL }
  }
});

async function fixCuidadoPersonal() {
  try {
    console.log('🔍 Conectando a Railway...');
    
    // 1. Ver todas las categorías
    console.log('\n📂 Categorías actuales:');
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (slug: ${cat.slug}) → ${cat._count.products} productos`);
    });
    
    // 2. Buscar "Cuidado Personal"
    console.log('\n🔍 Buscando "Cuidado Personal"...');
    const cuidadoPersonal = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { contains: 'Cuidado', mode: 'insensitive' } },
          { name: { contains: 'cuidado', mode: 'insensitive' } },
          { slug: { contains: 'cuidado' } }
        ]
      }
    });
    
    if (cuidadoPersonal) {
      console.log(`✅ Encontrada: "${cuidadoPersonal.name}" (slug actual: ${cuidadoPersonal.slug})`);
      
      if (cuidadoPersonal.slug !== 'cuidadopersonal') {
        console.log(`\n🔧 Corrigiendo slug de "${cuidadoPersonal.slug}" a "cuidadopersonal"...`);
        
        const updated = await prisma.category.update({
          where: { id: cuidadoPersonal.id },
          data: { slug: 'cuidadopersonal' }
        });
        
        console.log(`✅ Slug actualizado correctamente a: ${updated.slug}`);
      } else {
        console.log('✅ El slug ya es correcto: cuidadopersonal');
      }
    } else {
      console.log('❌ NO se encontró la categoría "Cuidado Personal"');
      console.log('\n🔧 Creando categoría...');
      
      const newCategory = await prisma.category.create({
        data: {
          name: 'Cuidado Personal',
          slug: 'cuidadopersonal',
          description: 'Productos de cuidado personal y belleza',
          image: '/images/categorias/cuidado-personal.png'
        }
      });
      
      console.log(`✅ Categoría creada: ${newCategory.name} (slug: ${newCategory.slug})`);
    }
    
    // 3. Verificar final
    console.log('\n✅ Verificación final:');
    const verify = await prisma.category.findUnique({
      where: { slug: 'cuidadopersonal' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    if (verify) {
      console.log(`✅ Categoría "Cuidado Personal" configurada correctamente`);
      console.log(`   Slug: ${verify.slug}`);
      console.log(`   Productos: ${verify._count.products}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixCuidadoPersonal();
