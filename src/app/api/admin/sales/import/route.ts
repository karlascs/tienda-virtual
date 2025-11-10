import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface ImportRow {
  fecha: string;
  cliente: string;
  rut?: string;
  email?: string;
  telefono?: string;
  metodoPago: string;
  skuProducto: string;
  cantidad: number;
  descuento?: number;
  notas?: string;
}

// POST - Importar ventas desde CSV
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Leer el contenido del archivo
    const text = await file.text();
    const lines = text.split("\n").filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "El archivo está vacío o no tiene datos" },
        { status: 400 }
      );
    }

    // Parsear CSV
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      rows.push({
        fecha: row.fecha,
        cliente: row.cliente,
        rut: row.rut,
        email: row.email,
        telefono: row.telefono || row["teléfono"],
        metodoPago: row["método de pago"] || row["metodo de pago"] || row.metodopago,
        skuProducto: row["sku producto"] || row.skuproducto,
        cantidad: parseInt(row.cantidad) || 1,
        descuento: parseFloat(row.descuento) || 0,
        notas: row.notas,
      });
    }

    // Agrupar por fecha y cliente para crear ventas
    const salesMap = new Map<string, any>();

    for (const row of rows) {
      const key = `${row.fecha}-${row.cliente}-${row.metodoPago}`;
      
      if (!salesMap.has(key)) {
        salesMap.set(key, {
          fecha: row.fecha,
          customerName: row.cliente,
          customerRut: row.rut,
          customerEmail: row.email,
          customerPhone: row.telefono,
          paymentMethod: row.metodoPago.toUpperCase(),
          items: [],
          notes: row.notas,
        });
      }

      const sale = salesMap.get(key);
      sale.items.push({
        sku: row.skuProducto,
        quantity: row.cantidad,
        discount: row.descuento,
      });
    }

    // Crear las ventas
    let created = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    for (const [key, saleData] of salesMap) {
      try {
        // Buscar productos y calcular total
        const items: any[] = [];
        let subtotal = 0;

        for (const item of saleData.items) {
          const product = await prisma.product.findUnique({
            where: { slug: item.sku },
            select: { id: true, name: true, slug: true, price: true, stock: true },
          });

          if (!product) {
            errorMessages.push(`Producto no encontrado: ${item.sku}`);
            throw new Error(`Producto no encontrado: ${item.sku}`);
          }

          if (product.stock < item.quantity) {
            errorMessages.push(`Stock insuficiente para ${product.name}`);
            throw new Error(`Stock insuficiente para ${product.name}`);
          }

          const itemSubtotal = product.price * item.quantity - (item.discount || 0);
          subtotal += itemSubtotal;

          items.push({
            productId: product.id,
            productName: product.name,
            productSku: product.slug,
            price: product.price,
            quantity: item.quantity,
            discount: item.discount || 0,
            subtotal: itemSubtotal,
          });
        }

        // Calcular impuestos
        const tax = subtotal * 0.19;
        const total = subtotal + tax;

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

        // Crear venta en transacción
        await prisma.$transaction(async (tx) => {
          const newSale = await tx.sale.create({
            data: {
              saleNumber,
              type: "PHYSICAL",
              status: "COMPLETED",
              customerName: saleData.customerName,
              customerEmail: saleData.customerEmail,
              customerPhone: saleData.customerPhone,
              customerRut: saleData.customerRut,
              subtotal,
              discount: 0,
              tax,
              shipping: 0,
              total,
              paymentMethod: saleData.paymentMethod,
              paymentStatus: "PAID",
              registeredBy: session.user?.email || "",
              notes: saleData.notes,
              createdAt: new Date(saleData.fecha),
              items: {
                create: items,
              },
            },
          });

          // Actualizar stock
          for (const item of items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: { stock: true },
            });

            const newStock = (product?.stock || 0) - item.quantity;

            await tx.product.update({
              where: { id: item.productId },
              data: { stock: newStock },
            });

            // Registrar movimiento
            await tx.inventoryMovement.create({
              data: {
                productId: item.productId,
                type: "SALE",
                quantity: -item.quantity,
                previousStock: product?.stock || 0,
                newStock,
                reason: "Venta importada desde CSV",
                reference: newSale.saleNumber,
                notes: `Cliente: ${saleData.customerName}`,
                performedBy: session.user?.email || "",
              },
            });
          }
        });

        created++;
      } catch (error: any) {
        console.error("Error al crear venta:", error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      created,
      errors,
      errorMessages: errorMessages.slice(0, 10), // Máximo 10 mensajes de error
    });
  } catch (error) {
    console.error("Error al importar ventas:", error);
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 }
    );
  }
}
