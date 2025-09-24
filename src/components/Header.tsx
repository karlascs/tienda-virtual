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
          {/* Logo de Casa Viva como elemento principal */}
          <Link href="/" className={styles.brand}>
            <Image 
              src="/logo_isa&cas.png"
              alt="IZA & CAS - Tienda Online"
              width={80}
              height={70}
              className={styles.logo}
              priority={true} // Cargar el logo con alta prioridad
            />
          </Link>
          
          {/* Enlaces de navegación */}
          <div className={styles.nav}>
            <Link href="/" className="link">Inicio</Link>
            <Link href="/products/hogar" className="link">Hogar</Link>
            <Link href="/products/herramientas" className="link">Herramientas</Link>
            <Link href="/products/juguetes" className="link">Juguetes</Link>
            <Link href="/products/tecnologia" className="link">Tecnología</Link>
            <Link href="/products/actividad" className="link">Actividad</Link>
            {/* Enlace al carrito de compras */}
            <Link href="/cart" className="link">Carrito (0)</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
