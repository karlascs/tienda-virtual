/**
 * API Routes para Analytics - IZA&CAS E-commerce
 * GET /api/analytics - Obtener estadísticas y métricas del sistema
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d' // 7d, 30d, 90d, 1y

    // Calcular fecha de inicio basada en el rango
    const now = new Date()
    const startDate = new Date(now)
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Ejecutar queries en paralelo para mejor performance
    const [
      // Estadísticas generales
      totalProducts,
      totalCategories,
      totalReviews,
      activeProducts,
      
      // Productos más vistos
      mostViewedProducts,
      
      // Productos mejor calificados
      topRatedProducts,
      
      // Productos más recientes
      recentProducts,
      
      // Distribución de calificaciones
      ratingDistribution,
      
      // Productos por categoría
      productsByCategory,
      
      // Vistas por día (últimos 30 días)
      dailyViews,
      
      // Reviews por día
      dailyReviews,
    ] = await Promise.all([
      // Conteos generales
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.review.count(),
      prisma.product.count({ where: { isActive: true } }),
      
      // Productos más vistos
      prisma.productView.groupBy({
        by: ['productId'],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          productId: true,
        },
        orderBy: {
          _count: {
            productId: 'desc',
          },
        },
        take: 10,
      }),
      
      // Productos mejor calificados
      prisma.product.findMany({
        where: {
          isActive: true,
          totalReviews: {
            gte: 1, // Al menos 1 reseña
          },
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
        ],
        take: 10,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      
      // Productos más recientes
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      
      // Distribución de calificaciones
      prisma.review.groupBy({
        by: ['rating'],
        _count: {
          rating: true,
        },
        orderBy: {
          rating: 'asc',
        },
      }),
      
      // Productos por categoría
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: {
                where: { isActive: true },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      
      // Vistas diarias
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as views
        FROM product_views 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
      
      // Reviews diarias
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as reviews,
          AVG(rating) as avg_rating
        FROM reviews 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
    ])

    // Obtener información completa de productos más vistos
    const mostViewedProductIds = mostViewedProducts.map(p => p.productId)
    const mostViewedProductsDetails = await prisma.product.findMany({
      where: {
        id: { in: mostViewedProductIds },
        isActive: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    // Combinar datos de vistas con detalles de productos
    const mostViewedWithDetails = mostViewedProducts.map(viewData => {
      const product = mostViewedProductsDetails.find(p => p.id === viewData.productId)
      return {
        product,
        views: viewData._count.productId,
      }
    }).filter(item => item.product) // Filtrar productos que no existen

    // Calcular métricas adicionales
    const totalViews = await prisma.productView.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const averageRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        // Estadísticas generales
        overview: {
          totalProducts,
          totalCategories,
          totalReviews,
          activeProducts,
          totalViews,
          averageRating: averageRating._avg.rating || 0,
          timeRange,
        },
        
        // Productos destacados
        mostViewedProducts: mostViewedWithDetails,
        topRatedProducts,
        recentProducts,
        
        // Distribuciones
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.rating
          return acc
        }, {} as Record<number, number>),
        
        productsByCategory: productsByCategory.map(cat => ({
          category: cat.name,
          slug: cat.slug,
          count: cat._count.products,
        })),
        
        // Datos de tiempo
        dailyViews,
        dailyReviews,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}