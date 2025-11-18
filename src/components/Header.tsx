'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import styles from "@/styles/header.module.css";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import SearchBar from "./SearchBar";
import { FEATURED_PRODUCTS, Product } from "@/data/products";

const MENU_CATEGORIES = [
  { 
    name: 'Hogar', 
    href: '/products/hogar', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  { 
    name: 'Electro Hogar', 
    href: '/products/electrohogar', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  { 
    name: 'Tecnología', 
    href: '/products/tecnologia', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  { 
    name: 'Juguetes', 
    href: '/products/juguetes', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>
  },
  { 
    name: 'Herramientas', 
    href: '/products/herramientas', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  },
  { 
    name: 'Cuidado Personal', 
    href: '/products/cuidadopersonal', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  },
  { 
    name: 'Actividad', 
    href: '/products/actividad', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  },
];

export default function Header() {
  const { data: session, status } = useSession();
  const { state } = useCart();
  const { wishlist } = useWishlist();
  const { clearSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    console.log('Producto seleccionado:', product);
    clearSearch();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    setMenuOpen(false);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.userMenuContainer}`)) {
        closeUserMenu();
      }
      if (!target.closest(`.${styles.dropdownMenu}`) && !target.closest(`.${styles.menuButton}`)) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <nav className={styles.mainNav} aria-label="principal">
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo_isa&cas.png"
              alt="IZA & CAS - Tienda Online"
              width={90}
              height={76}
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
          
          {/* Usuario / Login */}
          {status === 'loading' ? (
            <div className={styles.loginButton} title="Cargando...">
              <div className={styles.spinner}></div>
            </div>
          ) : session?.user ? (
            <div className={styles.userMenuContainer}>
              <button 
                className={styles.userButton} 
                onClick={toggleUserMenu}
                title={`Cuenta de ${session.user.name}`}
              >
                {session.user.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'Usuario'}
                    width={32}
                    height={32}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
              
              {userMenuOpen && (
                <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{session.user.name}</p>
                    <p className={styles.userEmail}>{session.user.email}</p>
                    {session.user.role === 'ADMIN' && (
                      <span className={styles.adminBadge}>Administrador</span>
                    )}
                  </div>
                  <div className={styles.userMenuDivider}></div>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      Panel de Admin
                    </Link>
                  )}
                  <Link href="/profile/orders" className={styles.userMenuItem} onClick={closeUserMenu}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    Mis Órdenes
                  </Link>
                  <Link href="/profile" className={styles.userMenuItem} onClick={closeUserMenu}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Mi Perfil
                  </Link>
                  <div className={styles.userMenuDivider}></div>
                  <button 
                    onClick={handleLogout} 
                    className={`${styles.userMenuItem} ${styles.logoutButton}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton} title="Iniciar Sesión">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}
          
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
                <span className={styles.categoryIcon}>{category.icon}</span>
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