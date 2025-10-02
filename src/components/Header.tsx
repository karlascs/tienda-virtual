'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/styles/header.module.css";
import { useCart } from "@/context/CartContext";

/**
 * Componente Header
 * 
 * Header principal de la aplicación que incluye:
 * - Logo de Casa Viva
 * - Navegación principal
 * - Enlaces a páginas importantes
 * - Contador del carrito de compras
 * - Efecto de transparencia dinámico al hacer scroll
 * - Menú hamburguesa responsive para móviles
 * 
 * Características:
 * - Sticky positioning (se mantiene fijo al hacer scroll)
 * - Transparencia dinámica basada en scroll
 * - Responsive design con menú hamburguesa
 * - Accesibilidad con aria-label
 * - Logo optimizado con Next.js Image
 * - Contador dinámico del carrito
 */
export default function Header() {
  const { state } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        {/* Navegación principal con etiqueta semántica */}
        <nav className={styles.row} aria-label="principal">
          {/* Logo de Casa Viva como elemento principal */}
          <Link href="/" className={styles.brand} onClick={closeMenu}>
            <Image 
              src="/logo_isa&cas.png"
              alt="IZA & CAS - Tienda Online"
              width={80}
              height={70}
              className={styles.logo}
              priority={true} // Cargar el logo con alta prioridad
            />
          </Link>
          
          {/* Botón hamburguesa para móviles */}
          <button 
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Abrir menú de navegación"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.active : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.active : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${menuOpen ? styles.active : ''}`}></span>
          </button>
          
          {/* Enlaces de navegación - siempre visible en desktop */}
          <div className={styles.nav}>
            <Link href="/" className="link" onClick={closeMenu}>Inicio</Link>
            <Link href="/products/hogar" className="link" onClick={closeMenu}>Hogar</Link>
            <Link href="/products/herramientas" className="link" onClick={closeMenu}>Herramientas</Link>
            <Link href="/products/juguetes" className="link" onClick={closeMenu}>Juguetes</Link>
            <Link href="/products/tecnologia" className="link" onClick={closeMenu}>Tecnología</Link>
            <Link href="/products/cuidadopersonal" className="link" onClick={closeMenu}>Cuidado Personal</Link>
            <Link href="/products/actividad" className="link" onClick={closeMenu}>Actividad</Link>
          </div>
          
          {/* Enlace al carrito - siempre visible */}
          <Link href="/cart" className={`link ${styles.cartLink}`} onClick={closeMenu}>
            🛒 Carrito ({state.itemCount})
          </Link>
        </nav>
        
        {/* Menú móvil desplegable */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.mobileLink} onClick={closeMenu}>Inicio</Link>
          <Link href="/products/hogar" className={styles.mobileLink} onClick={closeMenu}>Hogar</Link>
          <Link href="/products/herramientas" className={styles.mobileLink} onClick={closeMenu}>Herramientas</Link>
          <Link href="/products/juguetes" className={styles.mobileLink} onClick={closeMenu}>Juguetes</Link>
          <Link href="/products/tecnologia" className={styles.mobileLink} onClick={closeMenu}>Tecnología</Link>
          <Link href="/products/cuidadopersonal" className={styles.mobileLink} onClick={closeMenu}>Cuidado Personal</Link>
          <Link href="/products/actividad" className={styles.mobileLink} onClick={closeMenu}>Actividad</Link>
        </div>
      </div>
    </header>
  );
}
