/**
 * API de Confirmación de Pago - Transbank Webpay Plus
 * POST /api/checkout/confirm - Confirmar transacción después de redirección
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpay, TransbankStatus, VCICodes } from '@/lib/transbank';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token_ws } = body;

    if (!token_ws) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    console.log('🏦 Confirmando transacción Transbank:', token_ws);

    // Confirmar transacción con Transbank
    const response = await webpay.commit(token_ws);

    console.log('✅ Respuesta Transbank:', response);

    // Buscar orden por token
    const order = await prisma.order.findFirst({
      where: { paymentId: token_ws },
      include: { items: true },
    });

    if (!order) {
      console.error('❌ Orden no encontrada para token:', token_ws);
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Verificar estado de la transacción
    const isApproved = response.response_code === 0 && response.status === TransbankStatus.AUTHORIZED;

    if (isApproved) {
      // ✅ PAGO APROBADO
      console.log('✅ Pago aprobado para orden:', order.orderNumber);

      // Actualizar orden
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: `Webpay - ${response.card_detail.card_number}`,
        },
      });

      // Actualizar stock de productos
      for (const item of order.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (product) {
          const newStock = product.stock - item.quantity;
          
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          // Registrar movimiento de inventario
          await prisma.inventoryMovement.create({
            data: {
              productId: item.productId,
              type: 'SALE',
              quantity: -item.quantity,
              previousStock: product.stock,
              newStock,
              reason: 'Venta online',
              reference: order.orderNumber,
              notes: `Pago con Webpay - ${response.authorization_code}`,
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        approved: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: 'CONFIRMED',
        },
        payment: {
          authorizationCode: response.authorization_code,
          cardNumber: response.card_detail.card_number,
          transactionDate: response.transaction_date,
          amount: response.amount,
          paymentType: response.payment_type_code,
          installments: response.installments_number,
        },
      });

    } else {
      // ❌ PAGO RECHAZADO
      console.error('❌ Pago rechazado:', response);

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
        },
      });

      return NextResponse.json({
        success: false,
        approved: false,
        error: 'Pago rechazado por el banco',
        details: {
          responseCode: response.response_code,
          vci: response.vci,
          vciMessage: VCICodes[response.vci as keyof typeof VCICodes] || 'Desconocido',
        },
      });
    }

  } catch (error) {
    console.error('❌ Error al confirmar pago:', error);
    return NextResponse.json(
      { 
        error: 'Error al confirmar el pago',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
