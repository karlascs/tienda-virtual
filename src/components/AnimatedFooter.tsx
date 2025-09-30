'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedFooterProps {
  children: React.ReactNode;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'fade-in-scale';
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente AnimatedFooter
 * 
 * Footer específico con animaciones de scroll
 */
export default function AnimatedFooter({
  children,
  animation = 'fade-in-up',
  threshold = 0.1,
  className = '',
  style
}: AnimatedFooterProps) {
  const { elementRef, isVisible } = useScrollAnimation(threshold);

  const combinedClassName = [
    animation,
    isVisible ? 'visible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <footer
      ref={elementRef as React.RefObject<HTMLElement>}
      className={combinedClassName}
      style={style}
    >
      {children}
    </footer>
  );
}