import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/inventory
 * Obtener lista de productos con su inventario y movimientos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const lowStock = searchParams.get('lowStock') === 'true';
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '1000'); // Aumentado a 1000

    // Si se solicita un producto específico
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          inventoryMovements: {
            orderBy: { createdAt: 'desc' },
            take: 100
          }
        }
      });

      if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: product
      });
    }

    // Lista de productos con inventario
    const whereClause: any = {}; // Removido filtro isActive para mostrar TODOS
    if (lowStock) {
      whereClause.stock = { lte: 10 }; // Productos con stock <= 10
    }
    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId; // Filtrar por categoría
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        _count: {
          select: { inventoryMovements: true }
        }
      },
      orderBy: { stock: 'asc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Error al obtener inventario' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory
 * Crear un ajuste de inventario
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, type, quantity, reason, notes } = body;

    if (!productId || !type || quantity === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Obtener producto actual
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    // Calcular nuevo stock según el tipo de movimiento
    switch (type) {
      case 'PURCHASE':
      case 'RETURN':
      case 'ADJUSTMENT':
        newStock = previousStock + quantity;
        break;
      case 'SALE':
      case 'DAMAGE':
      case 'LOSS':
        newStock = previousStock - quantity;
        break;
      case 'INITIAL':
        newStock = quantity;
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de movimiento no válido' },
          { status: 400 }
        );
    }

    // No permitir stock negativo
    if (newStock < 0) {
      return NextResponse.json(
        { error: 'El stock no puede ser negativo' },
        { status: 400 }
      );
    }

    // Crear movimiento y actualizar producto en una transacción
    const result = await prisma.$transaction([
      // Crear movimiento de inventario
      prisma.inventoryMovement.create({
        data: {
          productId,
          type,
          quantity: type === 'SALE' || type === 'DAMAGE' || type === 'LOSS' ? -quantity : quantity,
          previousStock,
          newStock,
          reason,
          notes,
          performedBy: session.user.email || session.user.name
        }
      }),
      // Actualizar stock del producto
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Inventario actualizado correctamente'
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Error al actualizar inventario' },
      { status: 500 }
    );
  }
}
