/**
 * Utilidades para manejo de imágenes
 * 
 * Funciones para resolver problemas con nombres de archivos
 * que contienen caracteres especiales en Vercel
 */

/**
 * Codifica una URL de imagen para que sea compatible con Vercel
 * Maneja caracteres especiales como +, =, espacios, etc.
 * 
 * @param imageUrl - URL original de la imagen
 * @returns URL codificada compatible con Vercel
 */
export function encodeImageUrl(imageUrl: string): string {
  if (!imageUrl) return '/images/placeholder.svg';
  
  // Dividir la URL en partes para codificar solo el nombre del archivo
  const parts = imageUrl.split('/');
  
  // Codificar cada parte que pueda tener caracteres especiales
  const encodedParts = parts.map((part, index) => {
    // No codificar las primeras partes que son rutas básicas
    if (index < 2 || part === 'images') {
      return part;
    }
    
    // Codificar caracteres especiales comunes
    return part
      .replace(/\+/g, '%2B')  // + -> %2B
      .replace(/=/g, '%3D')   // = -> %3D
      .replace(/\s/g, '%20')  // espacio -> %20
      .replace(/#/g, '%23')   // # -> %23
      .replace(/&/g, '%26')   // & -> %26
      .replace(/\?/g, '%3F'); // ? -> %3F
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