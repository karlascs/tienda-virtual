/**
 * Rate Limiting para APIs - IZA&CAS E-commerce
 * Protección contra ataques de fuerza bruta y DDoS
 */

import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Almacenamiento en memoria (para producción usar Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Verifica el límite de peticiones para una IP
 * @param request - NextRequest
 * @param limit - Número máximo de peticiones
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns Objeto con información del rate limit
 */
export function checkRateLimit(
  request: NextRequest,
  limit: number = 10,
  windowMs: number = 60000 // 1 minuto por defecto
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  // Obtener identificador único (IP)
  const identifier = getClientIdentifier(request);
  const now = Date.now();
  
  // Obtener o crear entrada
  let entry = rateLimitStore.get(identifier);

  // Si no existe o ya expiró, crear nueva entrada
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, entry);
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: entry.resetTime,
    };
  }

  // Si alcanzó el límite
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Incrementar contador
  entry.count++;
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Obtiene un identificador único del cliente
 * @param request - NextRequest
 * @returns Identificador único (IP o combinación)
 */
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0].trim() || realIp || 'unknown';
  
  // Para mayor seguridad, combinar IP con User-Agent
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Limpia entradas expiradas del almacenamiento
 * Ejecutar periódicamente con setInterval
 */
export function cleanExpiredEntries(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Rate Limit: ${cleaned} entradas limpiadas`);
  }
}

/**
 * Reinicia el contador para un cliente específico
 * Útil después de login exitoso
 */
export function resetRateLimit(request: NextRequest): void {
  const identifier = getClientIdentifier(request);
  rateLimitStore.delete(identifier);
}

// Limpiar entradas expiradas cada 1 hora
if (typeof setInterval !== 'undefined') {
  setInterval(cleanExpiredEntries, 3600000); // 1 hora
}

/**
 * Middleware helper para aplicar rate limiting
 */
export function createRateLimitResponse(
  remaining: number,
  resetTime: number,
  retryAfter?: number
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  };

  if (retryAfter) {
    headers['Retry-After'] = Math.ceil(retryAfter / 1000).toString();
  }

  return headers;
}

/**
 * Presets de configuración para diferentes tipos de endpoints
 */
export const RateLimitPresets = {
  // Autenticación: 5 intentos por 15 minutos
  AUTH: { limit: 5, windowMs: 15 * 60 * 1000 },
  
  // APIs públicas: 100 peticiones por minuto
  PUBLIC_API: { limit: 100, windowMs: 60 * 1000 },
  
  // APIs de lectura: 60 peticiones por minuto
  READ_API: { limit: 60, windowMs: 60 * 1000 },
  
  // APIs de escritura: 20 peticiones por minuto
  WRITE_API: { limit: 20, windowMs: 60 * 1000 },
  
  // Upload de archivos: 5 por 5 minutos
  UPLOAD: { limit: 5, windowMs: 5 * 60 * 1000 },
  
  // Muy restrictivo: 3 por hora
  STRICT: { limit: 3, windowMs: 60 * 60 * 1000 },
};
