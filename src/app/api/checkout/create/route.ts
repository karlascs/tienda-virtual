/**
 * API de Checkout con Transbank Webpay Plus
 * POST /api/checkout/create - Iniciar transacción de pago
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { webpay, TRANSBANK_CONFIG } from '@/lib/transbank';
import { checkRateLimit, RateLimitPresets, createRateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // 🔒 Rate Limiting
    const rateLimitCheck = checkRateLimit(
      request,
      RateLimitPresets.WRITE_API.limit,
      RateLimitPresets.WRITE_API.windowMs
    );

    if (!rateLimitCheck.allowed) {
      const retryAfter = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento.' },
        {
          status: 429,
          headers: createRateLimitResponse(0, rateLimitCheck.resetTime, retryAfter * 1000),
        }
      );
    }

    // Verificar autenticación (opcional para invitados)
    const session = await auth();
    const isGuest = !session?.user;

    const body = await request.json();
    const {
      items,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingRut,
      shippingAddress,
      shippingCity,
      shippingRegion,
      shippingZip,
      notes,
    } = body;

    console.log('📦 Items recibidos:', JSON.stringify(items, null, 2));

    // Validaciones
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Validar que los items tengan productId
    for (const item of items) {
      if (!item.productId) {
        return NextResponse.json(
          { error: 'Item sin ID de producto' },
          { status: 400 }
        );
      }
    }

    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingRegion) {
      return NextResponse.json(
        { error: 'Datos de envío incompletos' },
        { status: 400 }
      );
    }

    // Calcular total y validar stock
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      // Convertir productId a string si es necesario
      const productId = typeof item.productId === 'string' 
        ? item.productId 
        : String(item.productId);

      console.log('🔍 Buscando producto:', {
        original: item.productId,
        converted: productId,
        type: typeof productId
      });

      // Intentar buscar por ID primero
      let product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, price: true, stock: true },
      });

      // Si no se encuentra, intentar buscar por SKU (para productos legacy con ID numérico)
      if (!product && !isNaN(Number(productId))) {
        const sku = `PRD-${String(productId).padStart(6, '0')}`;
        console.log('🔍 Buscando por SKU:', sku);
        
        product = await prisma.product.findUnique({
          where: { sku: sku },
          select: { id: true, name: true, price: true, stock: true },
        });
      }

      console.log('📦 Producto encontrado:', product ? `${product.name} (${product.id})` : 'NO ENCONTRADO');

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

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Calcular envío (el IVA ya está incluido en el precio de los productos)
    // Cotizar envío con Chilexpress si está disponible
    let shipping = 3000; // Fallback por defecto
    
    try {
      const shippingQuote = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/shipping/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commune: shippingCity,
          city: shippingCity,
          region: shippingRegion,
          items: orderItems.map(item => ({
            weight: 0.5, // Peso estimado por producto (500g)
            quantity: item.quantity
          })),
          totalValue: subtotal
        })
      });

      if (shippingQuote.ok) {
        const shippingData = await shippingQuote.json();
        if (shippingData.success && shippingData.quotes && shippingData.quotes.length > 0) {
          // Usar la opción más económica
          shipping = Math.min(...shippingData.quotes.map((q: any) => q.price));
          console.log('📦 Costo de envío Chilexpress:', shipping);
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cotizar con Chilexpress, usando tarifa fija:', error);
    }
    
    // Calcular comisión Transbank (2.95% + IVA sobre el subtotal + envío)
    const baseAmount = subtotal + shipping;
    const transbankCommission = Math.round(baseAmount * 0.0295); // 2.95%
    const transbankCommissionTax = Math.round(transbankCommission * 0.19); // IVA sobre comisión
    const totalTransbankFee = transbankCommission + transbankCommissionTax;
    
    const total = baseAmount + totalTransbankFee;
    const tax = 0; // IVA ya incluido en precios

    console.log('💰 Desglose de precios:', {
      subtotal: `$${subtotal.toLocaleString('es-CL')} (IVA incluido)`,
      shipping: `$${shipping.toLocaleString('es-CL')} (Chilexpress)`,
      transbankCommission: `$${transbankCommission.toLocaleString('es-CL')} (2.95%)`,
      transbankCommissionTax: `$${transbankCommissionTax.toLocaleString('es-CL')} (19% IVA sobre comisión)`,
      totalTransbankFee: `$${totalTransbankFee.toLocaleString('es-CL')}`,
      total: `$${total.toLocaleString('es-CL')}`
    });

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Crear orden en estado PENDING
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || undefined, // Undefined para invitados
        isGuest: isGuest,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        tax,
        shipping,
        transbankFee: totalTransbankFee,
        total,
        shippingName,
        shippingEmail,
        shippingPhone: shippingPhone || '',
        shippingRut: shippingRut || null,
        shippingAddress,
        shippingCity,
        shippingRegion: shippingRegion || '',
        shippingZip: shippingZip || '',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Iniciar transacción con Transbank
    const buyOrder = order.orderNumber;
    const sessionId = order.id;
    const amount = total;
    const returnUrl = TRANSBANK_CONFIG.returnUrl;

    console.log('🏦 Iniciando transacción Transbank:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl,
    });

    const transaction = await webpay.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    console.log('✅ Transacción creada:', transaction);

    // Guardar token de transacción en la orden
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: transaction.token,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
      transbank: {
        token: transaction.token,
        url: transaction.url,
      },
    });

  } catch (error) {
    console.error('❌ Error al crear checkout:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar el pago',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
