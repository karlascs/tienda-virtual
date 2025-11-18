#!/usr/bin/env node

/**
 * Pre-build script para asegurar que DATABASE_URL existe
 * Usado en Vercel donde no hay base de datos en build time
 */

if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL no encontrada, usando URL temporal para build...');
  process.env.DATABASE_URL = 'postgresql://temp:temp@localhost:5432/temp';
}

console.log('✅ DATABASE_URL configurada para build');
