/**
 * API de banners para admin
 * GET /api/admin/banners - Listar todos los banners
 * POST /api/admin/banners - Crear nuevo banner
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: banners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, imageUrl, link, order, isActive } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Título e imagen son requeridos' },
        { status: 400 }
      )
    }

    // Obtener el siguiente número de orden si no se proporciona
    let bannerOrder = order
    if (bannerOrder === undefined) {
      const lastBanner = await prisma.banner.findFirst({
        orderBy: { order: 'desc' }
      })
      bannerOrder = lastBanner ? lastBanner.order + 1 : 0
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        link: link || null,
        order: bannerOrder,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      data: banner
    })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear banner' },
      { status: 500 }
    )
  }
}
