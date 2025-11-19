/**
 * Helper para construir URLs de imágenes
 * En producción usa Railway, en desarrollo usa rutas locales
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Obtiene la URL completa de una imagen
 * @param imagePath - Ruta relativa de la imagen (ej: "/images/hogar/producto.jpg")
 * @returns URL completa de la imagen
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder.png';
  
  // Si ya es una URL completa, retornarla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si no empieza con /, agregarla
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // En producción (Vercel), usar Railway para imágenes
  if (IMAGE_BASE_URL && typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `${IMAGE_BASE_URL}${cleanPath}`;
  }
  
  // En desarrollo o Railway, usar ruta relativa
  return cleanPath;
}

/**
 * Obtiene múltiples URLs de imágenes
 */
export function getImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(getImageUrl);
}
