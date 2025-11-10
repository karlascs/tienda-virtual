/**
 * API de banner individual para admin
 * PUT /api/admin/banners/[id] - Actualizar banner
 * DELETE /api/admin/banners/[id] - Eliminar banner
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, subtitle, imageUrl, link, order, isActive } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Título e imagen son requeridos' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        link: link || null,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: banner
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar banner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Banner eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar banner' },
      { status: 500 }
    )
  }
}
