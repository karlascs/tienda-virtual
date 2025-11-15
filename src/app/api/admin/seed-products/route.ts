import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

/**
 * API Endpoint para cargar productos desde el admin
 * POST /api/admin/seed-products
 */

export async function POST(request: Request) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Requiere rol de ADMIN' },
        { status: 403 }
      );
    }

    console.log('🚀 Iniciando carga de productos...');

    // Mapeo de categorías
    const CATEGORY_MAP: Record<string, string> = {
      'actividad': 'actividad',
      'cuidadopersonal': 'cuidadopersonal',
      'electro hogar': 'electrohogar',
      'herramientas': 'herramientas',
      'hogar': 'hogar',
      'juguetes': 'juguetes',
      'tecnologia': 'tecnologia'
    };

    // Precios por subcategoría
    const PRICE_MAP: Record<string, number> = {
      'camping': 15990, 'deporte': 12990, 'piscina': 18990, 'playa': 14990,
      'car': 14990, 'iluminacion': 21990,
      'cocina': 12990, 'electrodomesticos': 16990, 'ropa de cama': 32990,
      'audifonos': 24990, 'camaras': 19990, 'celular': 29990,
      'carpas': 12990, 'juegos': 8990, 'libreria': 6990,
      'maquinaafeitar': 15990, 'relajación': 11990
    };

    const cleanName = (name: string) => name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([0-9]+)([a-z])/gi, '$1 $2')
      .replace(/[,\/]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .trim();

    const generateSlug = (name: string) => name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const generateSKU = (catSlug: string, seq: number) => 
      `SKU-${catSlug.substring(0,5).toUpperCase()}-${String(seq).padStart(3,'0')}`;

    // Escanear productos
    const publicPath = path.join(process.cwd(), 'public', 'images');
    const allProducts: any[] = [];
    const categories = ['actividad', 'cuidadopersonal', 'electro hogar', 'herramientas', 'hogar', 'juguetes', 'tecnologia'];

    for (const category of categories) {
      const categoryPath = path.join(publicPath, category);
      
      if (!fs.existsSync(categoryPath)) continue;

      const subcategories = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(d => d.isDirectory());

      for (const subcat of subcategories) {
        const subcatPath = path.join(categoryPath, subcat.name);
        const productFolders = fs.readdirSync(subcatPath, { withFileTypes: true })
          .filter(d => d.isDirectory());

        for (const prodFolder of productFolders) {
          const prodPath = path.join(subcatPath, prodFolder.name);
          const images = fs.readdirSync(prodPath)
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .map(img => `/images/${category}/${subcat.name}/${prodFolder.name}/${img}`);

          if (images.length > 0) {
            const name = cleanName(prodFolder.name);
            allProducts.push({
              name,
              slug: generateSlug(name),
              description: `${name} - IZA&CAS`,
              price: PRICE_MAP[subcat.name.toLowerCase()] || 14990,
              stock: Math.floor(Math.random() * 30) + 10,
              images,
              categorySlug: CATEGORY_MAP[category] || category,
            });
          }
        }
      }
    }

    // Cargar a la base de datos
    let created = 0;
    let updated = 0;
    const skuCounters: Record<string, number> = {};

    for (const product of allProducts) {
      const category = await prisma.category.findUnique({
        where: { slug: product.categorySlug }
      });

      if (!category) continue;

      if (!skuCounters[product.categorySlug]) {
        skuCounters[product.categorySlug] = 1;
      }

      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      });

      if (existing) {
        await prisma.product.update({
          where: { slug: product.slug },
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
          }
        });
        updated++;
      } else {
        let skuGenerated = false;
        let attempts = 0;

        while (!skuGenerated && attempts < 20) {
          const sku = generateSKU(product.categorySlug, skuCounters[product.categorySlug]);
          
          try {
            await prisma.product.create({
              data: {
                ...product,
                sku,
                categoryId: category.id,
                isActive: true,
                averageRating: 0,
                totalReviews: 0,
              }
            });
            created++;
            skuGenerated = true;
            skuCounters[product.categorySlug]++;
          } catch (error: any) {
            if (error.code === 'P2002') {
              skuCounters[product.categorySlug]++;
              attempts++;
            } else {
              throw error;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ Productos cargados exitosamente',
      stats: {
        created,
        updated,
        total: created + updated,
        scanned: allProducts.length,
      }
    });

  } catch (error: any) {
    console.error('Error en seed:', error);
    return NextResponse.json(
      { error: 'Error al cargar productos', details: error.message },
      { status: 500 }
    );
  }
}
