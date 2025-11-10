import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎄 Creando banner de Navidad...');

  // Crear banner de navidad
  const navidad = await prisma.banner.upsert({
    where: { id: 'navidad-2024' },
    update: {
      title: '🎄 ¡Llegó la Navidad!',
      subtitle: 'Encuentra los mejores regalos para tus seres queridos',
      imageUrl: '/LLEGO LA NAVIDAD.png',
      link: '/products',
      order: 1,
      isActive: true,
    },
    create: {
      id: 'navidad-2024',
      title: '🎄 ¡Llegó la Navidad!',
      subtitle: 'Encuentra los mejores regalos para tus seres queridos',
      imageUrl: '/LLEGO LA NAVIDAD.png',
      link: '/products',
      order: 1,
      isActive: true,
    },
  });

  console.log('✅ Banner de Navidad creado:', navidad.title);

  // Actualizar el banner por defecto para que sea el segundo
  await prisma.banner.updateMany({
    where: {
      imageUrl: '/bannerIZAyCAS.png'
    },
    data: {
      order: 2,
      isActive: true,
    },
  });

  console.log('✅ Banner por defecto actualizado como segundo');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
