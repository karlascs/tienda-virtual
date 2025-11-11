'use client';

import { useEffect } from 'react';
import styles from '@/styles/ChristmasEffects.module.css';

/**
 * Componente de Efectos Navideños
 * Agrega nieve cayendo, luces parpadeantes y brillo navideño
 */
export default function ChristmasEffects() {
  useEffect(() => {
    // Crear copos de nieve
    const createSnowflakes = () => {
      const container = document.getElementById('snowflakes-container');
      if (!container) return;

      // Crear 50 copos de nieve
      for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = styles.snowflake;
        snowflake.innerHTML = '❄';
        
        // Posición y animación aleatoria
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDelay = Math.random() * 10 + 's';
        snowflake.style.animationDuration = (Math.random() * 10 + 10) + 's';
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        snowflake.style.opacity = (Math.random() * 0.5 + 0.3).toString();
        
        container.appendChild(snowflake);
      }
    };

    createSnowflakes();

    // Limpiar al desmontar
    return () => {
      const container = document.getElementById('snowflakes-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      {/* Contenedor de copos de nieve */}
      <div id="snowflakes-container" className={styles.snowflakesContainer}></div>
      
      {/* Luces navideñas superiores */}
      <div className={styles.christmasLights}>
        <div className={styles.lightsString}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.light}
              style={{
                '--delay': `${i * 0.1}s`,
                '--color': ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'][i % 5]
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Brillo navideño en el fondo */}
      <div className={styles.christmasGlow}></div>
    </>
  );
}
