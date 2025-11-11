/**
 * API de gestión de productos para admin
 * PUT /api/admin/products/[id] - Actualizar producto
 * DELETE /api/admin/products/[id] - Eliminar producto
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validar campos requeridos
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    // Buscar categoría si se proporciona slug
    let categoryId = body.categoryId
    if (body.categorySlug && !categoryId) {
      const category = await prisma.category.findUnique({
        where: { slug: body.categorySlug }
      })
      if (category) categoryId = category.id
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        brand: body.brand,
        features: body.features || [],
        images: body.images || [],
        stock: body.stock ? parseInt(body.stock) : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : undefined,
        categoryId: categoryId || undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Soft delete - marcar como inactivo
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
