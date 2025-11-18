'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from '@/styles/FeaturedProducts.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category: string;
}

interface FeaturedProductsProps {
  onProductClick?: (product: Product) => void;
}

/**
 * Componente de Productos Destacados
 * Muestra 2 productos destacados de cada categoría en un carrusel horizontal
 * Los productos rotan automáticamente cada semana
 */
export default function FeaturedProducts({ onProductClick }: FeaturedProductsProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener el número de semana del año para rotación semanal
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=100');
        const result = await response.json();
        
        if (result.success && result.data) {
          const categories = [
            { slug: 'herramientas', name: 'Herramientas' },
            { slug: 'actividad', name: 'Actividad' },
            { slug: 'tecnologia', name: 'Tecnología' },
            { slug: 'hogar', name: 'Hogar' },
            { slug: 'juguetes', name: 'Juguetes' },
            { slug: 'electrohogar', name: 'Electrohogar' },
            { slug: 'cuidadopersonal', name: 'Cuidado Personal' }
          ];

          const weekNumber = getWeekNumber(new Date());
          const allFeatured: Product[] = [];

          categories.forEach(cat => {
            const categoryProducts = result.data.filter(
              (p: any) => p.category?.slug?.toLowerCase() === cat.slug.toLowerCase()
            );

            if (categoryProducts.length > 0) {
              // Usar el número de semana como seed para selección consistente durante la semana
              const seed = weekNumber;
              const shuffled = [...categoryProducts].sort((a, b) => {
                const hashA = (a.id * seed) % 1000;
                const hashB = (b.id * seed) % 1000;
                return hashA - hashB;
              });

              // Tomar los primeros 2 productos de la lista ordenada
              const selected = shuffled.slice(0, 2).map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.images?.[0] || '',
                images: p.images || [],
                description: p.description || '',
                category: cat.slug
              }));

              allFeatured.push(...selected);
            }
          });

          setFeaturedProducts(allFeatured);
        }
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Productos Destacados</h2>
          <div className={styles.loading}>Cargando productos destacados...</div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Productos Destacados</h2>
        
        <div className={styles.carousel}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productWrapper}>
              <ProductCard 
                {...product} 
                onClick={() => onProductClick?.(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
