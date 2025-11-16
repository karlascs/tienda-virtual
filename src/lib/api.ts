/**
 * Helper para construir URLs de API
 * En producción usa el backend de Railway, en desarrollo usa rutas locales
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function getApiUrl(path: string): string {
  // Si hay API_URL configurada, usarla
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  
  // En desarrollo o sin configurar, usar rutas relativas
  return path;
}

// Helper para fetch con la URL correcta
export async function apiFetch(path: string, options?: RequestInit) {
  const url = getApiUrl(path);
  return fetch(url, options);
}
