import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * Usado por Railway y Docker para verificar que la app está funcionando
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'IZA&CAS E-commerce',
    },
    { status: 200 }
  );
}
