'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import styles from '@/styles/Footer.module.css';

/**
 * Componente Footer principal
 * 
 * Footer completo para IZA&CAS con:
 * - Información de contacto
 * - Enlaces útiles
 * - Redes sociales
 * - Información de copyright
 * - Animaciones de scroll
 */
export default function Footer() {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  return (
    <footer 
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`${styles.footer} fade-in-up ${isVisible ? 'visible' : ''}`}
    >
      <div className={styles.container}>
        {/* Sección principal del footer */}
        <div className={styles.content}>
          
          {/* Información de la empresa */}
          <div className={styles.section}>
            <h3 className={styles.title}>IZA & CAS</h3>
            <p className={styles.description}>
              Tu tienda de confianza para hogar, tecnología y más. 
              Productos de calidad al mejor precio.
            </p>
            <div className={styles.contact}>
              <p>📞 +56 9 1234 5678</p>
              <p>📧 contacto@izaycas.cl</p>
              <p>📍 Santiago, Chile</p>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Enlaces Rápidos</h4>
            <ul className={styles.links}>
              <li><a href="/">Inicio</a></li>
              <li><a href="/products/hogar">Hogar</a></li>
              <li><a href="/products/tecnologia">Tecnología</a></li>
              <li><a href="/products/juguetes">Juguetes</a></li>
              <li><a href="/cart">Carrito</a></li>
            </ul>
          </div>

          {/* Categorías */}
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Categorías</h4>
            <ul className={styles.links}>
              <li><a href="/products/hogar">Electrodomésticos</a></li>
              <li><a href="/products/tecnologia">Computadores</a></li>
              <li><a href="/products/herramientas">Herramientas</a></li>
              <li><a href="/products/actividad">Actividades</a></li>
              <li><a href="/products/juguetes">Juguetes</a></li>
            </ul>
          </div>

          {/* Información legal y soporte */}
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Soporte</h4>
            <ul className={styles.links}>
              <li><a href="#ayuda">Centro de Ayuda</a></li>
              <li><a href="#envios">Envíos y Devoluciones</a></li>
              <li><a href="#terminos">Términos y Condiciones</a></li>
              <li><a href="#privacidad">Política de Privacidad</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>

        </div>

        {/* Separador */}
        <div className={styles.divider}></div>

        {/* Footer inferior */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2025 IZA & CAS. Todos los derechos reservados.</p>
            <p className={styles.developer}>Desarrollado por Karla Cuevas</p>
          </div>
          
          {/* Redes sociales */}
          <div className={styles.social}>
            <span>Síguenos:</span>
            <div className={styles.socialLinks}>
              <a href="#facebook" aria-label="Facebook">📘</a>
              <a href="#instagram" aria-label="Instagram">📷</a>
              <a href="#twitter" aria-label="Twitter">🐦</a>
              <a href="#whatsapp" aria-label="WhatsApp">📱</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}