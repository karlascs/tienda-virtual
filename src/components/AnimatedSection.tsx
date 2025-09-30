'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'fade-in-scale';
  threshold?: number;
  className?: string;
}

/**
 * Componente AnimatedSection
 * 
 * Wrapper que agrega animaciones de scroll a cualquier contenido.
 * Se activa cuando el elemento entra en el viewport.
 * 
 * @param children - Contenido a animar
 * @param animation - Tipo de animación (por defecto 'fade-in-up')
 * @param threshold - Porcentaje visible para activar (por defecto 0.1)
 * @param className - Clases CSS adicionales
 */
export default function AnimatedSection({
  children,
  animation = 'fade-in-up',
  threshold = 0.1,
  className = ''
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation(threshold);

  const combinedClassName = [
    animation,
    isVisible ? 'visible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={combinedClassName}
    >
      {children}
    </div>
  );
}