/**
 * API Routes para Reseñas - IZA&CAS E-commerce
 * GET /api/reviews - Listar reseñas con filtros
 * POST /api/reviews - Crear nueva reseña
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const rating = searchParams.get('rating')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Construir filtros
    const where: any = {}
    
    if (productId) where.productId = productId
    if (userId) where.userId = userId
    if (rating) where.rating = parseInt(rating)

    const skip = (page - 1) * limit

    // Obtener reseñas y conteo total
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    // Calcular estadísticas si es para un producto específico
    let stats = null
    if (productId) {
      const ratingStats = await prisma.review.groupBy({
        by: ['rating'],
        where: { productId },
        _count: {
          rating: true,
        },
      })

      const averageRating = await prisma.review.aggregate({
        where: { productId },
        _avg: {
          rating: true,
        },
      })

      stats = {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: totalCount,
        distribution: ratingStats.reduce((acc, stat) => {
          acc[stat.rating] = stat._count.rating
          return acc
        }, {} as Record<number, number>),
      }
    }

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

// POST /api/reviews (Crear reseña)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { productId, userId, rating, title, comment } = data
    
    // Validación básica
    if (!productId || !userId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campos requeridos: productId, userId, rating, comment',
        },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'La calificación debe estar entre 1 y 5',
        },
        { status: 400 }
      )
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado',
        },
        { status: 404 }
      )
    }

    // Verificar que el usuario existe (en un sistema real)
    // Por ahora, crearemos un usuario temporal si no existe
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      // En un sistema real, esto debería venir de la autenticación
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no autenticado',
        },
        { status: 401 }
      )
    }

    // Crear reseña (o actualizar si ya existe una del mismo usuario)
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        rating,
        title,
        comment,
        updatedAt: new Date(),
      },
      create: {
        productId,
        userId,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Actualizar estadísticas del producto
    const [averageRating, totalReviews] = await Promise.all([
      prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      }),
      prisma.review.count({
        where: { productId },
      }),
    ])

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews,
      },
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Reseña creada exitosamente',
    })
  } catch (error) {
    console.error('Error creating review:', error)
    
    // Manejar error de reseña duplicada
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya has dejado una reseña para este producto',
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