'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/header.module.css";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import SearchBar from "./SearchBar";
import { FEATURED_PRODUCTS, Product } from "@/data/products";

const MENU_CATEGORIES = [
  { name: 'Hogar', href: '/products/hogar', icon: '🏠' },
  { name: 'Electro Hogar', href: '/products/electrohogar', icon: '⚡' },
  { name: 'Tecnología', href: '/products/tecnologia', icon: '�' },
  { name: 'Juguetes', href: '/products/juguetes', icon: '🧸' },
  { name: 'Herramientas', href: '/products/herramientas', icon: '�' },
  { name: 'Cuidado Personal', href: '/products/cuidadopersonal', icon: '�' },
  { name: 'Actividad', href: '/products/actividad', icon: '⚽' },
];

export default function Header() {
  const { state } = useCart();
  const { wishlist } = useWishlist();
  const { clearSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    console.log('Producto seleccionado:', product);
    clearSearch();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <nav className={styles.mainNav} aria-label="principal">
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo_isa&cas.png"
              alt="IZA & CAS - Tienda Online"
              width={50}
              height={42}
              priority={true}
            />
          </Link>

          {/* Botón Menú - Icono de categorías más claro */}
          <button 
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Abrir menú de categorías"
            aria-expanded={menuOpen}
            title="Categorías"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>

          {/* Buscador de productos */}
          <div className={styles.searchSection}>
            <SearchBar 
              products={FEATURED_PRODUCTS}
              onProductSelect={handleProductSelect}
              placeholder="Buscar productos..."
            />
          </div>
          
          {/* Iniciar Sesión - Icono de usuario más claro */}
          <button className={styles.loginButton} title="Iniciar Sesión">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          
          {/* Favoritos - Icono de corazón más claro */}
          <Link href="/wishlist" className={styles.favoriteButton} title="Lista de Favoritos">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.itemCount > 0 && <span className={styles.badge}>{wishlist.itemCount}</span>}
          </Link>
          
          {/* Carrito - Icono de carrito más descriptivo */}
          <Link href="/cart" className={styles.cartButton} title="Carrito de Compras">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {state.itemCount > 0 && <span className={styles.badge}>{state.itemCount}</span>}
          </Link>
        </nav>

        {/* Menú desplegable */}
        {menuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
        <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ''}`}>
          <div className={styles.menuHeader}>
            <h3>Categorías</h3>
          </div>
          <div className={styles.menuContent}>
            {MENU_CATEGORIES.map((category) => (
              <Link 
                key={category.href}
                href={category.href} 
                className={styles.menuItem}
                onClick={closeMenu}
              >
                <span className={styles.categoryName}>{category.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrowIcon}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}