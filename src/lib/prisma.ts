/**
 * Configuración del cliente de Prisma para IZA&CAS E-commerce
 * Singleton pattern para reutilización eficiente del cliente
 */

import { PrismaClient } from '@prisma/client'

// Declaración global para TypeScript en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Obtener DATABASE_URL con fallback para build time
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  
  // Durante el build, si no hay DATABASE_URL, usar un placeholder
  // Railway configurará la variable real en runtime
  if (!url) {
    console.warn('⚠️ DATABASE_URL no definida, usando placeholder para build')
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
  }
  
  return url
}

// Crear instancia de Prisma con configuración optimizada
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

// En desarrollo, guardar la instancia globalmente para evitar múltiples conexiones
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Función para cerrar la conexión limpiamente
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

// Función de utilidad para verificar la conexión
export async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { success: true, message: 'Conexión a base de datos exitosa' }
  } catch (error) {
    console.error('Error de conexión a base de datos:', error)
    return { success: false, message: 'Error de conexión a base de datos' }
  }
}

// Tipos útiles exportados
export type * from '@prisma/client'