import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Construir filtro de fecha
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.lte = new Date(endDate);
      }
    }

    // Total de ventas
    const totalSales = await prisma.sale.count({
      where: dateFilter,
    });

    // Ventas por tipo
    const salesByType = await prisma.sale.groupBy({
      by: ["type"],
      where: dateFilter,
      _count: true,
      _sum: {
        total: true,
      },
    });

    // Ventas por estado
    const salesByStatus = await prisma.sale.groupBy({
      by: ["status"],
      where: dateFilter,
      _count: true,
    });

    // Total de ingresos
    const totalRevenue = await prisma.sale.aggregate({
      where: {
        ...dateFilter,
        status: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    });

    // Productos más vendidos
    const topProducts = await prisma.saleItem.groupBy({
      by: ["productId", "productName"],
      where: {
        sale: dateFilter,
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10,
    });

    // Ventas por día (últimos 30 días si no hay filtro)
    const defaultStartDate = startDate 
      ? new Date(startDate) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const defaultEndDate = endDate 
      ? new Date(endDate) 
      : new Date();

    const salesByDay = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count,
        SUM(total)::float as total
      FROM sales
      WHERE "createdAt" >= ${defaultStartDate}
        AND "createdAt" <= ${defaultEndDate}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;

    // Métodos de pago más usados
    const paymentMethods = await prisma.sale.groupBy({
      by: ["paymentMethod"],
      where: dateFilter,
      _count: true,
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({
      totalSales,
      salesByType: salesByType.map((item: any) => ({
        type: item.type,
        count: item._count,
        total: item._sum.total || 0,
      })),
      salesByStatus: salesByStatus.map((item: any) => ({
        status: item.status,
        count: item._count,
      })),
      totalRevenue: totalRevenue._sum.total || 0,
      topProducts: topProducts.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item._sum.quantity || 0,
        revenue: item._sum.subtotal || 0,
      })),
      salesByDay,
      paymentMethods: paymentMethods.map((item: any) => ({
        method: item.paymentMethod,
        count: item._count,
        total: item._sum.total || 0,
      })),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
