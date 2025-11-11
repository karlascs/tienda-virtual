/**
 * API para cotizar envíos con Chilexpress
 * POST /api/shipping/quote
 */

import { NextRequest, NextResponse } from 'next/server';
import { chilexpress, CHILEXPRESS_CONFIG } from '@/lib/chilexpress';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      commune,
      city,
      region,
      items, // Array de productos con peso y dimensiones
      totalValue,
    } = body;

    // Validaciones
    if (!commune || !city || !region) {
      return NextResponse.json(
        { error: 'Datos de destino incompletos' },
        { status: 400 }
      );
    }

    // Calcular peso y dimensiones totales
    let totalWeight = 0;
    const packages: any[] = [];

    if (items && items.length > 0) {
      // Si hay items con pesos específicos
      items.forEach((item: any) => {
        const weight = item.weight || 0.5; // 500g por defecto
        totalWeight += weight * item.quantity;
      });

      // Crear paquete
      packages.push({
        weight: Math.max(totalWeight, 0.5), // Mínimo 500g
        length: 30,
        width: 30,
        height: 10,
        declaredValue: totalValue || 0,
      });
    } else {
      // Paquete por defecto
      packages.push({
        ...CHILEXPRESS_CONFIG.defaultPackage,
        declaredValue: totalValue || 0,
      });
    }

    // Dirección de destino
    const destination = {
      streetName: '',
      streetNumber: '',
      commune,
      city,
      region,
    };

    // Cotizar con Chilexpress
    const quotes = await chilexpress.quoteShipping(
      CHILEXPRESS_CONFIG.defaultOrigin,
      destination,
      packages
    );

    // Formatear respuesta
    const formattedQuotes = quotes.map(quote => ({
      service: quote.serviceDescription,
      code: quote.serviceCode,
      price: quote.price,
      estimatedDays: quote.estimatedDeliveryDays,
      carrier: 'Chilexpress',
    }));

    return NextResponse.json({
      success: true,
      quotes: formattedQuotes,
      packages,
    });

  } catch (error) {
    console.error('❌ Error al cotizar envío:', error);
    
    // Si falla la API, devolver precio fijo
    return NextResponse.json({
      success: true,
      quotes: [
        {
          service: 'Envío Nacional',
          code: 'STANDARD',
          price: 3000,
          estimatedDays: 3,
          carrier: 'Envío Nacional',
        }
      ],
      fallback: true,
      message: 'Usando tarifa estándar (API no disponible)',
    });
  }
}
