/**
 * Seeder para banners iniciales de IZA&CAS
 * Crea banners por defecto para el carousel de la página principal
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBanners() {
  console.log('🎨 Creando banners iniciales...');

  // Banner principal IZA&CAS
  await prisma.banner.create({
    data: {
      title: 'De Todo Para Tu Hogar',
      subtitle: 'Descubre una amplia variedad de productos a precios accesibles',
      imageUrl: '/bannerIZAyCAS.png',
      link: null,
      order: 0,
      isActive: true
    }
  });

  console.log('✅ Banners iniciales creados exitosamente');
}

seedBanners()
  .catch((e) => {
    console.error('❌ Error al crear banners:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
