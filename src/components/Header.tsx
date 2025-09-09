import Link from "next/link";
import styles from "@/styles/header.module.css";

/**
 * Componente Header
 * 
 * Header principal de la aplicación que incluye:
 * - Logo/branding de la tienda
 * - Navegación principal
 * - Enlaces a páginas importantes
 * 
 * Características:
 * - Sticky positioning (se mantiene fijo al hacer scroll)
 * - Responsive design
 * - Accesibilidad con aria-label
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        {/* Navegación principal con etiqueta semántica */}
        <nav className={styles.row} aria-label="principal">
          {/* Logo/branding de la tienda */}
          <Link href="/" className={styles.brand}>
            🛒 MiTienda<span>.cl</span>
          </Link>
          
          {/* Enlaces de navegación */}
          <div className={styles.nav}>
            <Link href="/" className="link">Inicio</Link>
            <Link href="/cart" className="link">Carrito (0)</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
