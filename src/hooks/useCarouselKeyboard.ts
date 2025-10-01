import { useEffect } from 'react';

interface UseCarouselKeyboardProps {
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  totalImages: number;
}

export function useCarouselKeyboard({ 
  isActive, 
  onNext, 
  onPrev, 
  totalImages 
}: UseCarouselKeyboardProps) {
  useEffect(() => {
    if (!isActive || totalImages <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Espacio
          event.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onNext, onPrev, totalImages]);
}