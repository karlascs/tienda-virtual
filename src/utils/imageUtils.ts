/**
 * Utilidades para manejo de imágenes
 * 
 * Funciones para resolver problemas con nombres de archivos
 * que contienen caracteres especiales en Vercel
 */

import { getImageUrl } from '@/lib/image-url';

/**
 * Codifica una URL de imagen para que sea compatible con Vercel
 * Maneja caracteres especiales como +, =, espacios, etc.
 * 
 * @param imageUrl - URL original de la imagen
 * @returns URL codificada compatible con Vercel
 */
export function encodeImageUrl(imageUrl: string): string {
  if (!imageUrl) return '/images/placeholder.svg';
  
  // Usar el helper para obtener la URL correcta (Railway o local)
  const fullUrl = getImageUrl(imageUrl);
  
  // Dividir la URL en partes
  const parts = fullUrl.split('/');
  
  // Codificar cada parte excepto la primera (vacía) y 'images'
  const encodedParts = parts.map((part, index) => {
    // No codificar la parte vacía inicial, 'images', o las dos primeras barras
    if (part === '' || part === 'images' || index === 0 || part.startsWith('http')) {
      return part;
    }
    
    // Usar encodeURIComponent para cada parte del path
    // Esto codifica °, +, espacios, etc. correctamente
    return encodeURIComponent(part)
      .replace(/%2B/g, '+')  // Mantener + sin codificar (válido en URLs de archivos)
      .replace(/%3D/g, '='); // Mantener = sin codificar (válido en nombres de archivo)
  });
  
  return encodedParts.join('/');
}

/**
 * Función de fallback para imágenes que no cargan
 * Intenta diferentes estrategias antes de mostrar placeholder
 * 
 * @param originalUrl - URL original que falló
 * @returns Array de URLs alternativas para intentar
 */
export function getImageFallbacks(originalUrl: string): string[] {
  const fallbacks: string[] = [];
  
  // Intentar con URL codificada
  fallbacks.push(encodeImageUrl(originalUrl));
  
  // Intentar con diferentes extensiones
  const baseUrl = originalUrl.replace(/\.[^/.]+$/, "");
  fallbacks.push(`${baseUrl}.webp`);
  fallbacks.push(`${baseUrl}.png`);
  fallbacks.push(`${baseUrl}.jpeg`);
  
  // Placeholder como último recurso
  fallbacks.push('/images/placeholder.svg');
  
  return fallbacks;
}

/**
 * Hook para manejar carga de imágenes con fallbacks automáticos
 */
export function useImageWithFallback(originalSrc: string) {
  const fallbacks = getImageFallbacks(originalSrc);
  let currentFallbackIndex = 0;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    currentFallbackIndex++;
    if (currentFallbackIndex < fallbacks.length) {
      const target = e.target as HTMLImageElement;
      target.src = fallbacks[currentFallbackIndex];
    }
  };
  
  return {
    src: encodeImageUrl(originalSrc),
    onError: handleImageError
  };
}