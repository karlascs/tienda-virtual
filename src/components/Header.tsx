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
 * Componente Header Mejorado v2.0
 * 
 * Header principal con diseño moderno que incluye:
 * - Logo de IZA & CAS
 * - Barra de búsqueda prominente
 * - Dropdown de categorías vertical
 * - Botón de iniciar sesión
 * - Contador del carrito y wishlist
 * - Responsive design completo
 */

// Definir las categorías disponibles
const CATEGORIES = [
  { name: 'Hogar', href: '/products/hogar', icon: '🏠' },
  { name: 'Tecnología', href: '/products/tecnologia', icon: '📱' },
  { name: 'Juguetes', href: '/products/juguetes', icon: '🧸' },
  { name: 'Herramientas', href: '/products/herramientas', icon: '🔧' },
  { name: 'Cuidado Personal', href: '/products/cuidadopersonal', icon: '💅' },
  { name: 'Actividad', href: '/products/actividad', icon: '⚽' },
];

export default function Header() {
  const { state } = useCart();
  const { wishlist } = useWishlist();
  const { clearSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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
    setCategoriesOpen(false);
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const closeCategories = () => {
    setCategoriesOpen(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.categoriesDropdown}`)) {
        setCategoriesOpen(false);
      }
    };

    if (categoriesOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleProductSelect = (product: Product) => {
    console.log('Producto seleccionado:', product);
    clearSearch();
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.mainNav} aria-label="principal">
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image 
              src="/logo_isa&cas.png"
              alt="IZA & CAS - Tienda Online"
              width={60}
              height={50}
              priority={true}
            />
          </Link>
          
          {/* Barra de búsqueda prominente */}
          <div className={styles.searchSection}>
            <SearchBar 
              products={FEATURED_PRODUCTS}
              onProductSelect={handleProductSelect}
              placeholder="Buscar productos..."
            />
          </div>
          
          {/* Dropdown de Categorías */}
          <div className={styles.categoriesDropdown}>
            <button 
              className={styles.categoriesButton}
              onClick={toggleCategories}
              aria-expanded={categoriesOpen}
            >
              <span>Categorías</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={categoriesOpen ? styles.rotated : ''}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {categoriesOpen && (
              <div className={`${styles.dropdownMenu} ${categoriesOpen ? styles.open : ''}`}>
                {CATEGORIES.map((category) => (
                  <Link 
                    key={category.href}
                    href={category.href} 
                    className={styles.dropdownItem}
                    onClick={closeCategories}
                  >
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Botón Iniciar Sesión */}
          <button className={styles.loginButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Iniciar Sesión</span>
          </button>
          
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
        </nav>
        
        {/* Menú móvil */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
          {/* Búsqueda móvil */}
          <div className={styles.mobileSearchWrapper}>
            <SearchBar 
              products={FEATURED_PRODUCTS}
              onProductSelect={handleProductSelect}
              placeholder="Buscar productos..."
            />
          </div>
          
          {/* Categorías móvil */}
          <div className={styles.mobileCategoriesSection}>
            <h3 className={styles.mobileCategoriesTitle}>Categorías</h3>
            <div className={styles.mobileCategories}>
              {CATEGORIES.map((category) => (
                <Link 
                  key={category.href}
                  href={category.href} 
                  className={styles.mobileCategoryItem}
                  onClick={closeMenu}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Acciones móviles */}
          <div className={styles.mobileActions}>
            <button className={styles.mobileLoginButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Iniciar Sesión
            </button>
            
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
