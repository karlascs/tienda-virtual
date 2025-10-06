import styles from "@/styles/card.module.css";

/**
 * Tipo de propiedades para el componente ProductCard
 */
type Props = { 
  name: string;   // Nombre del producto
  price: number;  // Precio en pesos chilenos (número)
  image: string;  // URL de la imagen principal
  onClick?: () => void; // Función para manejar clic en la tarjeta
};

/**
 * Componente ProductCard - Versión Profesional Minimalista
 * 
 * Tarjeta individual de producto optimizada para e-commerce moderno:
 * - Solo muestra información esencial (imagen, nombre, precio)
 * - Diseño limpio y profesional
 * - Interacción completa se maneja en el modal de detalles
 * 
 * @param name - Nombre del producto
 * @param price - Precio en número (se formatea automáticamente)
 * @param image - URL de la imagen principal
 * @param onClick - Función que se ejecuta al hacer clic en la tarjeta
 */
export default function ProductCard({ name, price, image, onClick }: Props) {
  return (
    <article 
      className={`${styles.card} card`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Contenedor de imagen con overlay para hover */}
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={name}
          className={styles.productImage}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.svg';
          }}
        />
        <div className={styles.imageOverlay}>
          <span className={styles.viewDetailsText}>Ver Detalles</span>
        </div>
      </div>
      
      {/* Información minimalista del producto */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productPrice}>
          {price.toLocaleString("es-CL", { 
            style: "currency", 
            currency: "CLP" 
          })}
        </p>
      </div>
    </article>
  );
}
