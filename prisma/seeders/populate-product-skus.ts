import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Genera un código SKU único basado en la categoría y un número secuencial
 * Formato: SKU-CATEGORIA-NNN (ej: SKU-HOGAR-001, SKU-TECNO-045)
 */
function generateSKU(categorySlug: string, sequence: number): string {
  // Tomar las primeras 5 letras de la categoría en mayúsculas
  const categoryCode = categorySlug.substring(0, 5).toUpperCase();
  // Número secuencial con 3 dígitos
  const seqNumber = sequence.toString().padStart(3, '0');
  return `SKU-${categoryCode}-${seqNumber}`;
}

/**
 * Genera SKU alternativo si hay colisión
 */
function generateAlternativeSKU(baseSlug: string, attempt: number): string {
  const cleanSlug = baseSlug
    .substring(0, 10)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `SKU-${cleanSlug}-${attempt.toString().padStart(3, '0')}`;
}

async function populateProductSKUs() {
  console.log('🔄 Iniciando generación de códigos SKU...\n');

  try {
    // Obtener todos los productos agrupados por categoría
    const categories = await prisma.category.findMany({
      include: {
        products: {
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { slug: 'asc' }
    });

    let totalUpdated = 0;
    let totalErrors = 0;

    for (const category of categories) {
      if (category.products.length === 0) {
        console.log(`⏭️  Categoría "${category.name}" sin productos\n`);
        continue;
      }

      console.log(`📦 Procesando categoría: ${category.name} (${category.products.length} productos)`);
      
      let sequenceNumber = 1;

      for (const product of category.products) {
        let skuGenerated = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!skuGenerated && attempts < maxAttempts) {
          try {
            let sku: string;

            if (attempts === 0) {
              // Primera intentada: SKU basado en categoría y secuencia
              sku = generateSKU(category.slug, sequenceNumber);
            } else {
              // Intentos subsecuentes: SKU basado en slug del producto
              sku = generateAlternativeSKU(product.slug, attempts);
            }

            // Intentar actualizar el producto
            await prisma.product.update({
              where: { id: product.id },
              data: { sku }
            });

            console.log(`  ✅ ${product.name.substring(0, 40).padEnd(40)} → ${sku}`);
            totalUpdated++;
            skuGenerated = true;
            sequenceNumber++;

          } catch (error: any) {
            attempts++;
            
            if (error.code === 'P2002') {
              // Código duplicado, intentar de nuevo
              console.log(`  ⚠️  SKU duplicado, reintentando... (intento ${attempts})`);
            } else {
              console.error(`  ❌ Error al actualizar ${product.name}:`, error.message);
              totalErrors++;
              break;
            }
          }
        }

        if (!skuGenerated) {
          console.error(`  ❌ No se pudo generar SKU para ${product.name} después de ${maxAttempts} intentos`);
          totalErrors++;
        }
      }

      console.log(''); // Línea en blanco entre categorías
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Proceso completado:`);
    console.log(`   - Productos actualizados: ${totalUpdated}`);
    console.log(`   - Errores: ${totalErrors}`);
    console.log('='.repeat(60));

    // Verificar SKUs duplicados
    const allProducts = await prisma.product.findMany({
      select: { sku: true }
    });
    const skus = allProducts.map(p => p.sku);
    const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);

    if (duplicates.length > 0) {
      console.log(`\n⚠️  ADVERTENCIA: ${duplicates.length} SKUs duplicados encontrados`);
      console.log('SKUs duplicados:', [...new Set(duplicates)]);
    } else {
      console.log('\n✅ Todos los productos tienen código SKU único');
    }

  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
populateProductSKUs()
  .catch((error) => {
    console.error('Error ejecutando el script:', error);
    process.exit(1);
  });
