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
    title: 'Mesas Naturales',
    subtitle: 'Productos esenciales para tu hogar',
    image: '/images/categorias/hogar.png',
    count: 6,
    href: '/products/hogar'
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    title: 'Herramientas Profesionales',
    subtitle: 'Todo lo que necesitas para tus proyectos',
    image: '/images/categorias/herramientas.png',
    count: 8,
    href: '/products/herramientas'
  },
  {
    id: 'juguetes',
    name: 'Juguetes',
    title: 'Diversión y Aprendizaje',
    subtitle: 'Juguetes educativos para todas las edades',
    image: '/images/categorias/juguetes.png',
    count: 10,
    href: '/products/juguetes'
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    title: 'Tecnología Avanzada',
    subtitle: 'Los últimos avances tecnológicos',
    image: '/images/categorias/tecnologia.png',
    count: 10,
    href: '/products/tecnologia'
  },
  {
    id: 'actividad',
    name: 'Actividad',
    title: 'Vida Activa',
    subtitle: 'Equipos para mantenerte en forma',
    image: '/images/categorias/actividad.png',
    count: 6,
    href: '/products/actividad'
  }
];

/**
 * Componente de Categorías
 * 
 * Muestra las diferentes categorías de productos como banners horizontales
 * con imágenes de fondo y diseño moderno inspirado en tiendas premium
 * 
 * @returns Componente de categorías con navegación visual
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
              className={styles.banner}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              aria-label={`Ver ${category.name} (${category.count} productos)`}
            >
              <div className={styles.content}>
                <h3 className={styles.title}>{category.title}</h3>
                <p className={styles.subtitle}>{category.subtitle}</p>
                <span className={styles.button}>VER MÁS</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}