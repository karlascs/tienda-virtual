'use client';

import React from 'react';
import Link from 'next/link';
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
 * - Mapa de Google Maps
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
          
          {/* Información principal de IZA & CAS */}
          <div className={styles.mainSection}>
            
            {/* Información de la empresa */}
            <div className={styles.companyInfo}>
              <h3 className={styles.title}>IZA & CAS</h3>
              <p className={styles.description}>
                Tu tienda de confianza para hogar, tecnología y más. 
                Productos de calidad al mejor precio.
              </p>
              <div className={styles.contact}>
                <p>📱 +56 9 3768 4428</p>
                <p>� +56 9 2056 5248</p>
                <p>�📧 contacto@izaycas.cl</p>
                <p>📍 Simón Bolívar 485, 2390030 Valparaíso, Chile</p>
                <div className={styles.whatsappButtons}>
                  <a 
                    href="https://wa.me/56937684428?text=Hola!%20Vi%20su%20tienda%20online%20y%20me%20interesa%20conocer%20más%20productos" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.whatsappButton}
                    title="WhatsApp Principal - +56 9 3768 4428"
                  >
                    💬 WhatsApp Principal
                  </a>
                  <a 
                    href="https://wa.me/56920565248?text=Hola!%20Vi%20su%20tienda%20online%20y%20me%20interesa%20conocer%20más%20productos" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${styles.whatsappButton} ${styles.whatsappSecondary}`}
                    title="WhatsApp Secundario - +56 9 2056 5248"
                  >
                    💬 WhatsApp Ventas
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div className={styles.locationSection}>
              <h4 className={styles.subtitle}>Nuestra Ubicación</h4>
              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.8944842527244!2d-71.62663892479069!3d-33.04539747356821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689e0d65bf6c1e5%3A0x4e7a9c1b8a9d2d1a!2sSimón%20Bolívar%20485%2C%20Valparaíso%2C%20Chile!5e0!3m2!1ses!2scl!4v1696176000000!5m2!1ses!2scl"
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación IZA&CAS - Simón Bolívar 485, Valparaíso"
                ></iframe>
              </div>
              <p className={styles.mapDescription}>
                Visítanos en nuestro local en el corazón de Valparaíso
              </p>
            </div>

            {/* Redes sociales y horarios */}
            <div className={styles.socialAndSchedule}>
              {/* Horarios de atención */}
              <div className={styles.schedule}>
                <h4 className={styles.subtitle}>Horarios de Atención</h4>
                <div className={styles.scheduleList}>
                  <p>🕒 Lunes a Viernes: 10:00 - 18:00</p>
                  <p>🕒 Sábados: 10:00 - 15:00</p>
                  <p>� Domingos: CERRADO</p>
                  <p className={styles.highlight}>📞 ¡Contáctanos por WhatsApp!</p>
                </div>
              </div>

              {/* Redes sociales */}
              <div className={styles.social}>
                <span>Síguenos en nuestras redes:</span>
                <div className={styles.socialLinks}>
                  <a href="https://www.facebook.com/search/top?q=Iza%20%26%20Cas%20home%20store" target="_blank" rel="noopener noreferrer" aria-label="Facebook - Iza & Cas home store" title="Facebook - Iza & Cas home store" className={styles.facebook}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                  <a href="https://www.instagram.com/iza.y.cas" target="_blank" rel="noopener noreferrer" aria-label="Instagram - @iza.y.cas" title="Instagram - @iza.y.cas" className={styles.instagram}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a href="https://www.tiktok.com/@izaycas" target="_blank" rel="noopener noreferrer" aria-label="TikTok - @izaycas" title="TikTok - @izaycas" className={styles.tiktok}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                  <a href="https://wa.me/56937684428?text=Hola!%20Vi%20su%20tienda%20online%20y%20me%20interesa%20conocer%20más%20productos" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Principal - +56 9 3768 4428" title="WhatsApp Principal - +56 9 3768 4428" className={styles.whatsapp}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Sección de enlaces */}
          <div className={styles.linksSection}>
            
            {/* Enlaces rápidos y categorías */}
            <div className={styles.quickLinks}>
              <h4 className={styles.subtitle}>Categorías</h4>
              <ul className={styles.links}>
                <li><Link href="/products/hogar">🏠 Hogar</Link></li>
                <li><Link href="/products/tecnologia">💻 Tecnología</Link></li>
                <li><Link href="/products/juguetes">🧸 Juguetes</Link></li>
                <li><Link href="/products/herramientas">🔧 Herramientas</Link></li>
                <li><Link href="/cart">🛒 Carrito</Link></li>
              </ul>
            </div>

            {/* Información legal y soporte */}
            <div className={styles.support}>
              <h4 className={styles.subtitle}>Soporte y Ayuda</h4>
              <ul className={styles.links}>
                <li><a href="#ayuda">❓ Centro de Ayuda</a></li>
                <li><a href="#envios">📦 Envíos y Devoluciones</a></li>
                <li><a href="#terminos">📋 Términos y Condiciones</a></li>
                <li><a href="#privacidad">🔒 Política de Privacidad</a></li>
                <li><a href="#contacto">📞 Contacto</a></li>
              </ul>
            </div>

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
          
          <div className={styles.bottomLinks}>
            <p>✨ ¡Síguenos en redes sociales para ofertas exclusivas!</p>
          </div>
        </div>

        {/* Botón volver arriba */}
        <div className={styles.backToTop}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={styles.backToTopButton}
            aria-label="Volver al inicio"
            title="Volver al inicio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z"/>
            </svg>
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>
    </footer>
  );
}