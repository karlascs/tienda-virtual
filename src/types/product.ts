/**
 * Tipos compartidos de productos para toda la aplicación
 * Centralizados para evitar conflictos entre API y componentes
 */

export interface Product {
  id: string | number; // Acepta ambos para compatibilidad
  name: string;
  slug?: string;
  description: string;
  price: number;
  images?: string[]; // Opcional para compatibilidad con datos legacy
  image?: string; // Primera imagen como principal
  brand?: string;
  category?: string;
  categoryId?: string;
  features?: string[];
  stock?: number;
  averageRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}
