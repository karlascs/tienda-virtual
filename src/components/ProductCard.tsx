import styles from "@/styles/card.module.css";

/**
 * Tipo de propiedades para el componente ProductCard
 */
type Props = { 
  name: string;   // Nombre del producto
  price: number;  // Precio en pesos chilenos (número)
  image: string;  // URL de la imagen del producto
};

/**
 * Componente ProductCard
 * 
 * Tarjeta individual de producto que muestra:
 * - Imagen del producto
 * - Nombre del producto
 * - Precio formateado en pesos chilenos
 * 
 * Características:
 * - Props tipadas con TypeScript
 * - Formateo automático de precios
 * - HTML semántico con <article>
 * - CSS Modules para estilos aislados
 * 
 * @param name - Nombre del producto
 * @param price - Precio en número (se formatea automáticamente)
 * @param image - URL de la imagen
 */
export default function ProductCard({ name, price, image }: Props) {
  return (
    <article className={`${styles.card} card`}>
      {/* Imagen del producto */}
      <img src={image} alt={name} />
      
      {/* Información del producto */}
      <div className="body">
        <h3>{name}</h3>
        <p className="price">
          {/* Formateo automático de precio en pesos chilenos */}
          {price.toLocaleString("es-CL", { 
            style: "currency", 
            currency: "CLP" 
          })}
        </p>
      </div>
    </article>
  );
}
