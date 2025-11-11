const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://izacas:izacas2024@database:5432/izacas?schema=public'
    }
  }
});

async function main() {
  console.log('🌱 Cargando datos en Docker...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Crear categorías
  console.log('📁 Creando categorías...');
  const categorias = await Promise.all([
    prisma.category.create({ data: { name: 'Juguetes', slug: 'juguetes', description: 'Juguetes para niños' }}),
    prisma.category.create({ data: { name: 'Tecnología', slug: 'tecnologia', description: 'Productos tecnológicos' }}),
    prisma.category.create({ data: { name: 'Hogar', slug: 'hogar', description: 'Artículos para el hogar' }}),
    prisma.category.create({ data: { name: 'Electrohogar', slug: 'electrohogar', description: 'Electrodomésticos' }}),
    prisma.category.create({ data: { name: 'Herramientas', slug: 'herramientas', description: 'Herramientas' }}),
    prisma.category.create({ data: { name: 'Actividad', slug: 'actividad', description: 'Deportes y actividades' }}),
    prisma.category.create({ data: { name: 'Cuidado Personal', slug: 'cuidadopersonal', description: 'Cuidado personal' }})
  ]);
  console.log('✅', categorias.length, 'categorías creadas');

  // Crear productos
  console.log('📦 Creando productos...');
  const productos = [
    { name: 'Carpa Casita de Princesa', slug: 'carpa-casita-princesa', sku: 'CARP-PRIN-001', price: 25990, stock: 15, categoryId: categorias[0].id, images: ['/images/juguetes/carpa-princesa.jpg'], description: 'Hermosa carpa con diseño de princesa' },
    { name: 'Carpa de Castillo Infantil', slug: 'carpa-castillo-infantil', sku: 'CARP-CAST-002', price: 27990, stock: 12, categoryId: categorias[0].id, images: ['/images/juguetes/carpa-castillo.jpg'], description: 'Carpa con forma de castillo' },
    { name: 'Carpa Túnel', slug: 'carpa-tunel', sku: 'CARP-TUN-003', price: 22990, stock: 20, categoryId: categorias[0].id, images: ['/images/juguetes/carpa-tunel.jpg'], description: 'Carpa túnel para jugar' },
    { name: 'Balón de Fútbol Air Power', slug: 'balon-futbol-air-power', sku: 'BAL-FUT-004', price: 15990, stock: 30, categoryId: categorias[0].id, images: ['/images/juguetes/balon-futbol.jpg'], description: 'Balón de fútbol flotante' },
    { name: 'Proyector Astronauta Infantil', slug: 'proyector-astronauta', sku: 'PROY-AST-005', price: 35990, stock: 8, categoryId: categorias[0].id, images: ['/images/juguetes/proyector-astronauta.jpg'], description: 'Proyector de estrellas' },
    { name: 'Set de Cocina Kitchen', slug: 'set-cocina-kitchen', sku: 'SET-COC-006', price: 29990, stock: 10, categoryId: categorias[0].id, images: ['/images/juguetes/set-cocina.jpg'], description: 'Set de cocina completo' },
    { name: 'Audífonos Inalámbricos IRM', slug: 'audifonos-inalambricos-irm', sku: 'AUD-IRM-007', price: 12990, stock: 25, categoryId: categorias[1].id, images: ['/images/tecnologia/audifonos-irm.jpg'], description: 'Audífonos bluetooth' },
    { name: 'Cámara de Seguridad 360°', slug: 'camara-seguridad-360', sku: 'CAM-360-008', price: 45990, stock: 15, categoryId: categorias[1].id, images: ['/images/tecnologia/camara-360.jpg'], description: 'Cámara de seguridad WiFi' },
    { name: 'Mini Cámara Espía HD', slug: 'mini-camara-espia-hd', sku: 'CAM-ESP-009', price: 35990, stock: 10, categoryId: categorias[1].id, images: ['/images/tecnologia/mini-camara.jpg'], description: 'Cámara espía compacta' },
    { name: 'Cable USB Tipo C', slug: 'cable-usb-tipo-c', sku: 'CAB-USB-010', price: 5990, stock: 50, categoryId: categorias[1].id, images: ['/images/tecnologia/cable-usb-c.jpg'], description: 'Cable USB-C de carga rápida' },
  ];

  for (const prod of productos) {
    await prisma.product.create({ data: prod });
    console.log('  ✅', prod.name);
  }
  console.log('✅', productos.length, 'productos creados');

  console.log('🎉 Datos cargados exitosamente! Crea el usuario admin desde el panel.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
