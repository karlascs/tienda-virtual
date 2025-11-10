import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET - Listar todas las ventas con filtros
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
    const type = searchParams.get("type"); // ONLINE o PHYSICAL
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Construir filtros
    const whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (status) {
      whereClause.status = status;
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      whereClause.OR = [
        { saleNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        items: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva venta (principalmente para ventas físicas)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      type = "PHYSICAL",
      customerName,
      customerEmail,
      customerPhone,
      customerRut,
      paymentMethod,
      items,
      discount = 0,
      shipping = 0,
      notes,
    } = body;

    // Validaciones
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Debe incluir al menos un producto" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Debe especificar el método de pago" },
        { status: 400 }
      );
    }

    // Generar número de venta
    const lastSale = await prisma.sale.findFirst({
      orderBy: { createdAt: "desc" },
      select: { saleNumber: true },
    });

    let saleNumber = "VTA-0001";
    if (lastSale) {
      const lastNumber = parseInt(lastSale.saleNumber.split("-")[1]);
      saleNumber = `VTA-${String(lastNumber + 1).padStart(4, "0")}`;
    }

    // Calcular subtotal y validar stock
    let subtotal = 0;
    const saleItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, slug: true, price: true, stock: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` },
          { status: 400 }
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.slug,
        price: product.price,
        quantity: item.quantity,
        discount: item.discount || 0,
        subtotal: itemSubtotal - (item.discount || 0),
      });
    }

    // Calcular impuestos (19% IVA en Chile)
    const tax = (subtotal - discount) * 0.19;
    const total = subtotal - discount + tax + shipping;

    // Crear venta y actualizar inventario en una transacción
    const sale = await prisma.$transaction(async (tx) => {
      // Crear la venta
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          type,
          status: "COMPLETED",
          customerName,
          customerEmail,
          customerPhone,
          customerRut,
          subtotal,
          discount,
          tax,
          shipping,
          total,
          paymentMethod,
          paymentStatus: "PAID",
          registeredBy: session.user?.email || "",
          notes,
          items: {
            create: saleItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Actualizar stock y crear movimientos de inventario
      for (const item of saleItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        const newStock = (product?.stock || 0) - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        // Registrar movimiento de inventario
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: "SALE",
            quantity: -item.quantity,
            previousStock: product?.stock || 0,
            newStock,
            reason: type === "PHYSICAL" ? "Venta en local físico" : "Venta online",
            reference: newSale.saleNumber,
            notes: customerName ? `Cliente: ${customerName}` : undefined,
            performedBy: session.user?.email || "",
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error al crear venta:", error);
    return NextResponse.json(
      { error: "Error al crear venta" },
      { status: 500 }
    );
  }
}
