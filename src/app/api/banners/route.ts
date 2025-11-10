/**
 * API pública de banners
 * GET /api/banners - Obtener banners activos para mostrar en la página principal
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
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
