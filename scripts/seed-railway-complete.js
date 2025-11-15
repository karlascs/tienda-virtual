const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * SEEDER COMPLETO PARA RAILWAY
 * Carga TODOS los productos de TODAS las categorías con sus imágenes
 */

// Mapeo de carpetas a categorías en la BD
const CATEGORY_MAP = {
  'actividad': 'actividad',
  'cuidadopersonal': 'cuidadopersonal',
  'electro hogar': 'electrohogar',
  'herramientas': 'herramientas',
  'hogar': 'hogar',
  'juguetes': 'juguetes',
  'tecnologia': 'tecnologia'
};

// Precios sugeridos por subcategoría
const PRICE_MAP = {
  // Actividad
  'camping': 15990,
  'deporte': 12990,
  'piscina': 18990,
  'playa': 14990,
  
  // Herramientas
  'car': 14990,
  'iluminacion': 21990,
  
  // Hogar
  'cocina': 12990,
  'electrodomesticos': 16990,
  'ropa de cama': 32990,
  'alfombras': 18990,
  
  // Tecnología
  'audifonos': 24990,
  'camaras': 19990,
  'celular': 29990,
  
  // Juguetes
  'carpas': 12990,
  'juegos': 8990,
  'libreria': 6990,
  
  // Cuidado Personal
  'maquinaafeitar': 15990,
  'relajación': 11990
};

function cleanProductName(folderName) {
  return folderName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([0-9]+)([a-z])/gi, '$1 $2')
    .replace(/[,\/]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPrice(subcategory) {
  return PRICE_MAP[subcategory.toLowerCase()] || 14990;
}

function generateSKU(categorySlug, sequence) {
  const categoryCode = categorySlug.substring(0, 5).toUpperCase();
  const seqNumber = sequence.toString().padStart(3, '0');
  return `SKU-${categoryCode}-${seqNumber}`;
}

function scanProductFolders(basePath, categorySlug) {
  const products = [];
  
  if (!fs.existsSync(basePath)) {
    console.log(`⚠️  Carpeta no encontrada: ${basePath}`);
    return products;
  }

  const subcategories = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const subcategory of subcategories) {
    const subcategoryPath = path.join(basePath, subcategory.name);
    
    if (!fs.existsSync(subcategoryPath)) continue;
    
    const productFolders = fs.readdirSync(subcategoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const productFolder of productFolders) {
      const productPath = path.join(subcategoryPath, productFolder.name);
      
      if (!fs.existsSync(productPath)) continue;
      
      const imageFiles = fs.readdirSync(productPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

      if (imageFiles.length > 0) {
        const productName = cleanProductName(productFolder.name);
        const images = imageFiles.map(img => 
          `/images/${categorySlug}/${subcategory.name}/${productFolder.name}/${img}`
        );

        products.push({
          name: productName,
          slug: generateSlug(productName),
          description: `${productName} - Producto de calidad de IZA&CAS`,
          price: getPrice(subcategory.name),
          stock: Math.floor(Math.random() * 30) + 10,
          images,
          categorySlug: CATEGORY_MAP[categorySlug] || categorySlug,
          isActive: true
        });
      }
    }
  }

  return products;
}

async function main() {
  console.log('🚀 SEEDER COMPLETO PARA RAILWAY - Iniciando...\n');
  console.log('📦 Cargando productos con todas sus imágenes\n');

  // Verificar que las categorías existan
  console.log('🔍 Verificando categorías en la base de datos...');
  const existingCategories = await prisma.category.findMany();
  console.log(`   ✅ Encontradas ${existingCategories.length} categorías\n`);

  if (existingCategories.length === 0) {
    console.log('❌ No hay categorías en la base de datos.');
    console.log('   Ejecuta primero: npx prisma migrate deploy');
    process.exit(1);
  }

  const publicPath = path.join(process.cwd(), 'public', 'images');
  const allProducts = [];

  // Escanear todas las categorías
  const categories = ['actividad', 'cuidadopersonal', 'electro hogar', 'herramientas', 'hogar', 'juguetes', 'tecnologia'];

  console.log('📂 Escaneando carpetas de productos...\n');
  
  for (const category of categories) {
    const categoryPath = path.join(publicPath, category);
    const products = scanProductFolders(categoryPath, category);
    allProducts.push(...products);
    console.log(`   ${category.padEnd(20)} → ${products.length} productos`);
  }

  console.log(`\n📊 Total de productos encontrados: ${allProducts.length}\n`);
  console.log('💾 Cargando productos a PostgreSQL en Railway...\n');

  let created = 0;
  let updated = 0;
  let errors = 0;
  const skuCounters = {};

  for (const product of allProducts) {
    try {
      // Buscar la categoría
      const category = await prisma.category.findUnique({
        where: { slug: product.categorySlug }
      });

      if (!category) {
        console.log(`⚠️  Categoría no encontrada: ${product.categorySlug}`);
        errors++;
        continue;
      }

      // Inicializar contador de SKU
      if (!skuCounters[product.categorySlug]) {
        const lastProduct = await prisma.product.findFirst({
          where: { categoryId: category.id },
          orderBy: { createdAt: 'desc' }
        });
        skuCounters[product.categorySlug] = lastProduct ? 1 : 1;
      }

      // Verificar si el producto ya existe
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      });

      if (existing) {
        // Actualizar producto existente
        await prisma.product.update({
          where: { slug: product.slug },
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
            isActive: product.isActive
          }
        });
        updated++;
      } else {
        // Crear nuevo producto con SKU único
        let skuGenerated = false;
        let attempts = 0;
        
        while (!skuGenerated && attempts < 20) {
          const sku = generateSKU(product.categorySlug, skuCounters[product.categorySlug]);
          
          try {
            await prisma.product.create({
              data: {
                name: product.name,
                slug: product.slug,
                sku: sku,
                description: product.description,
                price: product.price,
                stock: product.stock,
                images: product.images,
                categoryId: category.id,
                isActive: product.isActive,
                averageRating: 0,
                totalReviews: 0
              }
            });
            created++;
            skuGenerated = true;
            skuCounters[product.categorySlug]++;
          } catch (error) {
            if (error.code === 'P2002') {
              // SKU duplicado, incrementar y reintentar
              skuCounters[product.categorySlug]++;
              attempts++;
            } else {
              throw error;
            }
          }
        }
        
        if (!skuGenerated) {
          console.log(`❌ No se pudo generar SKU para ${product.name}`);
          errors++;
        }
      }

      // Mostrar progreso
      const total = created + updated;
      if (total % 10 === 0) {
        console.log(`   Procesados: ${total}/${allProducts.length} (${Math.round(total/allProducts.length*100)}%)`);
      }

    } catch (error) {
      console.error(`❌ Error con ${product.name}:`, error.message);
      errors++;
    }
  }

  console.log('\n✅ CARGA COMPLETADA!\n');
  console.log('📊 RESUMEN:');
  console.log(`   ✨ Productos creados: ${created}`);
  console.log(`   🔄 Productos actualizados: ${updated}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📦 Total: ${created + updated} productos\n`);
  
  // Mostrar resumen por categoría
  console.log('📋 PRODUCTOS POR CATEGORÍA:\n');
  const categoryCounts = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  let totalProducts = 0;
  for (const cat of categoryCounts) {
    console.log(`   ${cat.name.padEnd(20)} → ${cat._count.products} productos`);
    totalProducts += cat._count.products;
  }
  
  console.log(`\n   ${'TOTAL'.padEnd(20)} → ${totalProducts} productos\n`);
  
  console.log('🎉 ¡Base de datos lista con todas las fotos!\n');
  console.log('🌐 Ahora puedes abrir tu app en Railway y verás todos los productos con imágenes.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ ERROR FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
