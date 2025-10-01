'use client';

import React, { useState } from 'react';

interface ProductBannerProps {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[]; // Array de imágenes
    description: string;
    category: string;
  };
  isVisible: boolean;
}

/**
 * Componente ProductBanner
 * 
 * Banner interactivo de producto con carrusel de imágenes
 * Permite navegar entre múltiples fotos del producto
 */
export default function ProductBanner({ product, isVisible }: ProductBannerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="product-banner"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease',
      }}
    >
      {/* Banner principal del producto */}
      <div style={{
        background: 'var(--card-background)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-color)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }}
      >
        {/* Carrusel de imágenes */}
        <div style={{
          position: 'relative',
          height: '280px',
          background: '#f8fafc',
          overflow: 'hidden'
        }}>
          {/* Imagen principal */}
          <img 
            src={product.images[currentImageIndex]} 
            alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px',
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* Botones de navegación (solo si hay más de 1 imagen) */}
          {product.images.length > 1 && (
            <>
              {/* Botón anterior */}
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ‹
              </button>

              {/* Botón siguiente */}
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ›
              </button>

              {/* Indicadores de imagen */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 2
              }}>
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentImageIndex 
                        ? 'var(--brand)' 
                        : 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>

              {/* Contador de imágenes */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </>
          )}
        </div>

        {/* Información del producto */}
        <div style={{ padding: '20px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            {product.name}
          </h3>
          
          <p style={{ 
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            {product.description}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="price" style={{ 
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--brand)'
            }}>
              ${product.price.toLocaleString('es-CL')}
            </div>
            
            <span style={{
              background: 'var(--background-secondary)',
              color: 'var(--text-secondary)',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}