import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/header.module.css";

/**
 * Componente Header
 * 
 * Header principal de la aplicación que incluye:
 * - Logo de Casa Viva
 * - Navegación principal
 * - Enlaces a páginas importantes
 * 
 * Características:
 * - Sticky positioning (se mantiene fijo al hacer scroll)
 * - Responsive design
 * - Accesibilidad con aria-label
 * - Logo optimizado con Next.js Image
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        {/* Navegación principal con etiqueta semántica */}
        <nav className={styles.row} aria-label="principal">
          {/* Logo de Casa Viva */}
          <Link href="/" className={styles.brand}>
            <Image 
              src="/logo_casaviva.png"
              alt="Casa Viva - Tienda Online"
              width={40}
              height={40}
              className={styles.logo}
              priority={true} // Cargar el logo con alta prioridad
            />
            <span className={styles.brandText}>
              Casa Viva<span>.cl</span>
            </span>
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
