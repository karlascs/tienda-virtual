import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/inventory/stats
 * Obtener estadísticas del inventario
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Estadísticas generales
    const [
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
      recentMovements
    ] = await Promise.all([
      // Total de productos activos
      prisma.product.count({ where: { isActive: true } }),
      
      // Productos con bajo stock (<=10)
      prisma.product.count({
        where: { isActive: true, stock: { lte: 10, gt: 0 } }
      }),
      
      // Productos sin stock
      prisma.product.count({
        where: { isActive: true, stock: 0 }
      }),
      
      // Valor total del inventario
      prisma.product.aggregate({
        where: { isActive: true },
        _sum: { stock: true }
      }),
      
      // Movimientos recientes (últimos 7 días)
      prisma.inventoryMovement.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Productos más movidos
    const topMovedProducts = await prisma.inventoryMovement.groupBy({
      by: ['productId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    const topProducts = await Promise.all(
      topMovedProducts.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, stock: true, images: true }
        });
        return {
          ...product,
          movementsCount: item._count.id
        };
      })
    );

    // Movimientos por tipo en los últimos 30 días
    const movementsByType = await prisma.inventoryMovement.groupBy({
      by: ['type'],
      _sum: { quantity: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalStock: totalStockValue._sum.stock || 0,
        recentMovements,
        topMovedProducts: topProducts,
        movementsByType
      }
    });

  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
