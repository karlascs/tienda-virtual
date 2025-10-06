'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/styles/header.module.css";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import SearchBar from "./SearchBar";
import { FEATURED_PRODUCTS, Product } from "@/data/products";

/**
 * Componente Header Mejorado
 * 
 * Header principal de la aplicación que incluye:
 * - Logo de IZA & CAS
 * - Barra de búsqueda en tiempo real
 * - Navegación principal
 * - Contador del carrito de compras
 * - Contador de lista de deseos
 * - Efecto de transparencia dinámico al hacer scroll
 * - Menú hamburguesa responsive para móviles
 * 
 * Características nuevas:
 * - Búsqueda en tiempo real con dropdown
 * - Acceso rápido a wishlist
 * - Notificaciones visuales
 * - Mejor responsive design
 */
export default function Header() {
  const { state } = useCart();
  const { wishlist } = useWishlist();
  const { clearSearch } = useSearch();
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

  const handleProductSelect = (product: Product) => {
    // Redirigir a la página del producto (implementar más tarde)
    console.log('Producto seleccionado:', product);
    clearSearch();
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        {/* Navegación principal con etiqueta semántica */}
        <nav className={styles.row} aria-label="principal">
          {/* Logo de IZA & CAS como elemento principal */}
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
          
          {/* Barra de búsqueda - visible en desktop */}
          <div className={styles.searchWrapper}>
            <SearchBar 
              products={FEATURED_PRODUCTS}
              onProductSelect={handleProductSelect}
              placeholder="Buscar productos..."
            />
          </div>
          
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
          
          {/* Acciones del usuario */}
          <div className={styles.userActions}>
            {/* Wishlist */}
            <Link href="/wishlist" className={`${styles.actionButton} ${styles.wishlistButton}`} onClick={closeMenu}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlist.itemCount > 0 && (
                  <span className={styles.badge}>{wishlist.itemCount}</span>
                )}
              </div>
              <span className={styles.actionText}>Favoritos</span>
            </Link>
            
            {/* Carrito */}
            <Link href="/cart" className={`${styles.actionButton} ${styles.cartButton}`} onClick={closeMenu}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H2m5 7v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8m-8 4h.01M16 17h.01" />
                </svg>
                {state.itemCount > 0 && (
                  <span className={styles.badge}>{state.itemCount}</span>
                )}
              </div>
              <span className={styles.actionText}>Carrito</span>
            </Link>
          </div>
        </nav>
        
        {/* Menú móvil desplegable */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
          {/* Búsqueda móvil */}
          <div className={styles.mobileSearchWrapper}>
            <SearchBar 
              products={FEATURED_PRODUCTS}
              onProductSelect={handleProductSelect}
              placeholder="Buscar productos..."
            />
          </div>
          
          {/* Enlaces de navegación móvil */}
          <div className={styles.mobileLinks}>
            <Link href="/" className={styles.mobileLink} onClick={closeMenu}>Inicio</Link>
            <Link href="/products/hogar" className={styles.mobileLink} onClick={closeMenu}>Hogar</Link>
            <Link href="/products/herramientas" className={styles.mobileLink} onClick={closeMenu}>Herramientas</Link>
            <Link href="/products/juguetes" className={styles.mobileLink} onClick={closeMenu}>Juguetes</Link>
            <Link href="/products/tecnologia" className={styles.mobileLink} onClick={closeMenu}>Tecnología</Link>
            <Link href="/products/cuidadopersonal" className={styles.mobileLink} onClick={closeMenu}>Cuidado Personal</Link>
            <Link href="/products/actividad" className={styles.mobileLink} onClick={closeMenu}>Actividad</Link>
          </div>
          
          {/* Acciones móviles */}
          <div className={styles.mobileActions}>
            <Link href="/wishlist" className={styles.mobileActionButton} onClick={closeMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Favoritos ({wishlist.itemCount})
            </Link>
            <Link href="/cart" className={styles.mobileActionButton} onClick={closeMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H2m5 7v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8m-8 4h.01M16 17h.01" />
              </svg>
              Carrito ({state.itemCount})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}






