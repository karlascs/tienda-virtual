/**
 * API para crear productos (admin)
 * POST /api/admin/products - Crear nuevo producto
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      images,
      categorySlug,
      stock,
      rating,
      discount,
      specifications
    } = body

    // Validaciones básicas
    if (!name || !price || !categorySlug) {
      return NextResponse.json(
        { success: false, error: 'Nombre, precio y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Buscar la categoría por slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Generar SKU único
    const categoryCode = category.slug.substring(0, 5).toUpperCase()
    const productCount = await prisma.product.count({
      where: { categoryId: category.id }
    })
    const sku = `SKU-${categoryCode}-${(productCount + 1).toString().padStart(3, '0')}`

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        sku,
        description: description || null,
        price: parseFloat(price),
        images: images || [],
        categoryId: category.id,
        stock: stock !== undefined ? parseInt(stock) : 0,
        discount: discount !== undefined ? parseInt(discount) : 0,
        isActive: true
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
