// Configuración de URLs de API
export const API_CONFIG = {
  // En producción (Vercel), usar Railway backend
  // En desarrollo, usar localhost
  baseURL: process.env.NEXT_PUBLIC_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://iza-y-cas-production.up.railway.app'
             : 'http://localhost:3000'),
  
  // Timeout para las peticiones
  timeout: 10000,
};

// Helper para construir URLs de API
export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.baseURL}${cleanPath}`;
};
