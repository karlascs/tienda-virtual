import Link from "next/link";
import styles from "@/styles/header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.row} aria-label="principal">
          <Link href="/" className={styles.brand}>🛒 MiTienda<span>.cl</span></Link>
          <div className={styles.nav}>
            <Link href="/" className="link">Inicio</Link>
            <Link href="/cart" className="link">Carrito (0)</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
