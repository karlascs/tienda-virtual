/**
 * API de categoría individual para admin
 * PUT /api/admin/categories/[id] - Actualizar categoría
 * DELETE /api/admin/categories/[id] - Eliminar categoría
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, slug, description, image } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Nombre y slug requeridos' },
        { status: 400 }
      )
    }

    // Verificar si existe otra categoría con el mismo slug
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id: params.id }
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe otra categoría con ese slug' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || null,
        image: image || null
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar categoría' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar si la categoría tiene productos
    const productsCount = await prisma.product.count({
      where: { categoryId: params.id }
    })

    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, error: `No se puede eliminar. Tiene ${productsCount} productos asociados` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar categoría' },
      { status: 500 }
    )
  }
}
