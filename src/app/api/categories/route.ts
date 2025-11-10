/**
 * API Routes para Categorías - IZA&CAS E-commerce
 * GET /api/categories - Listar todas las categorías
 * POST /api/categories - Crear nueva categoría (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeCount = searchParams.get('includeCount') === 'true'

    const categories = await prisma.category.findMany({
      include: {
        products: includeProducts ? {
          where: { isActive: true },
          take: 10, // Limitar a 10 productos por categoría
          orderBy: { createdAt: 'desc' },
        } : false,
        _count: includeCount ? {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        } : false,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

// POST /api/categories (Crear categoría - admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { name, description, image } = data
    
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre es requerido',
        },
        { status: 400 }
      )
    }

    // Generar slug único
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear categoría
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Error creating category:', error)
    
    // Manejar error de nombre duplicado
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe una categoría con este nombre',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}