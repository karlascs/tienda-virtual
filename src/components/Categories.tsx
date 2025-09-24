import Link from 'next/link';
import styles from './Categories.module.css';

/**
 * Datos de las categorías de productos
 * Sincronizadas con los enlaces de navegación del header
 */
const CATEGORIES = [
  {
    id: 'hogar',
    name: 'Hogar',
    icon: '🏠',
    count: 6,
    href: '/products/hogar'
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    icon: '🔧',
    count: 8,
    href: '/products/herramientas'
  },
  {
    id: 'juguetes',
    name: 'Juguetes',
    icon: '🧸',
    count: 10,
    href: '/products/juguetes'
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    icon: '💻',
    count: 10,
    href: '/products/tecnologia'
  },
  {
    id: 'actividad',
    name: 'Actividad',
    icon: '⚽',
    count: 6,
    href: '/products/actividad'
  }
];

/**
 * Componente de Categorías
 * 
 * Muestra las diferentes categorías de productos disponibles
 * en un diseño de cards horizontales responsive
 * 
 * @returns Componente de categorías con navegación
 */
export default function Categories() {
  return (
    <section className={styles.categories}>
      <div className="container">
        <h2 className={styles.title}>Categorías</h2>
        <div className={styles.grid}>
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={styles.card}
              aria-label={`Ver ${category.name} (${category.count} productos)`}
            >
              <div className={styles.icon}>{category.icon}</div>
              <div className={styles.info}>
                <h3 className={styles.name}>{category.name}</h3>
                <span className={styles.count}>{category.count} productos</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}