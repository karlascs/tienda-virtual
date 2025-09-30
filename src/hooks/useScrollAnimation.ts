'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook personalizado para animaciones de scroll
 * 
 * Detecta cuando un elemento entra en el viewport y le agrega la clase 'visible'
 * para activar las animaciones CSS definidas en globals.css
 * 
 * @param threshold - Porcentaje del elemento que debe estar visible (0-1)
 * @param rootMargin - Margen adicional para el observer
 * @returns ref para el elemento y estado de visibilidad
 */
export function useScrollAnimation(threshold: number = 0.1, rootMargin: string = '0px') {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez visible, no necesitamos seguir observando
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible };
}

/**
 * Hook para animar múltiples elementos con delay progresivo
 * 
 * @param itemCount - Número de elementos a animar
 * @param threshold - Porcentaje del elemento que debe estar visible
 * @returns Array de refs y estados de visibilidad
 */
export function useScrollAnimationList(itemCount: number, threshold: number = 0.1) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => {
              const newItems = [...prev];
              newItems[index] = true;
              return newItems;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    const container = containerRef.current;
    if (container) {
      const items = container.querySelectorAll('[data-index]');
      items.forEach(item => observer.observe(item));
    }

    return () => {
      if (container) {
        const items = container.querySelectorAll('[data-index]');
        items.forEach(item => observer.unobserve(item));
      }
    };
  }, [threshold, itemCount]);

  return { containerRef, visibleItems };
}