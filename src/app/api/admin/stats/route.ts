/**
 * API de estadísticas del dashboard admin
 * GET /api/admin/stats - Obtener estadísticas generales
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener estadísticas en paralelo
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      topProducts,
    ] = await Promise.all([
      // Total de productos activos
      prisma.product.count({
        where: { isActive: true }
      }),
      
      // Total de categorías
      prisma.category.count(),
      
      // Total de órdenes
      prisma.order.count(),
      
      // Revenue total
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
      }),
      
      // Últimas 5 órdenes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, images: true }
              }
            }
          }
        }
      }),
      
      // Productos con stock bajo (< 5)
      prisma.product.findMany({
        where: {
          isActive: true,
          stock: { lt: 5 }
        },
        select: {
          id: true,
          name: true,
          stock: true,
          price: true,
          images: true
        },
        orderBy: { stock: 'asc' },
        take: 10
      }),
      
      // Top 5 productos más vendidos
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: true,
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      })
    ])

    // Obtener detalles de top products
    const topProductIds = topProducts.map(p => p.productId)
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        stock: true
      }
    })

    // Combinar datos de top products
    const topProductsWithDetails = topProducts.map(tp => {
      const product = topProductDetails.find(p => p.id === tp.productId)
      return {
        ...product,
        totalSold: tp._sum.quantity || 0,
        orderCount: tp._count
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue: totalRevenue._sum.total || 0
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          total: order.total,
          status: order.status,
          itemCount: order.items.length,
          createdAt: order.createdAt,
          items: order.items.slice(0, 3) // Primeros 3 items
        })),
        lowStockProducts,
        topProducts: topProductsWithDetails
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
