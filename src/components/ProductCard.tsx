import { useState } from "react";
import styles from "@/styles/card.module.css";
import { useImageWithFallback } from "@/utils/imageUtils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useReviews } from "@/context/ReviewsContext";
import { useRecommendations } from "@/context/RecommendationsContext";
import { useBrowsingHistory } from "@/context/BrowsingHistoryContext";
import { Product } from "@/data/products";
import StarRating from "./StarRating";

/**
 * Tipo de propiedades para el componente ProductCard
 */
interface Props extends Omit<Product, 'description' | 'features'> {
  onClick?: () => void; // Función para manejar clic en la tarjeta
}

/**
 * Componente ProductCard - Versión Interactiva Avanzada
 * 
 * Tarjeta individual de producto con funcionalidades completas:
 * - Información esencial (imagen, nombre, precio)
 * - Badge "NUEVO" para productos recientes
 * - Botón de wishlist/favoritos con estado persistente
 * - Botón de agregar al carrito con animación
 * - Diseño responsivo y accesible
 * - Interacciones suaves y feedback visual
 * 
 * @param product - Todos los datos del producto (id, name, price, image, category)
 * @param onClick - Función que se ejecuta al hacer clic en la tarjeta
 */
export default function ProductCard({ id, name, price, image, images, category, onClick, createdAt }: Props) {
  const imageProps = useImageWithFallback(image || '');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { getAverageRating, getProductRating } = useReviews();
  const { trackProductView } = useRecommendations();
  const { addToHistory } = useBrowsingHistory();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Crear producto con images por defecto
  const product: Product = { 
    id, 
    name, 
    price, 
    image, 
    images: images || (image ? [image] : []), 
    category, 
    description: '' 
  };
  
  // Convertir id a number para funciones que esperan number
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  
  const inWishlist = isInWishlist(numericId);
  const inCompare = isInCompare(numericId);
  const averageRating = getAverageRating(numericId);
  const productRating = getProductRating(numericId);

  // Determinar si el producto es nuevo (creado en los últimos 30 días)
  const isNew = createdAt ? (() => {
    const creationDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return creationDate > thirtyDaysAgo;
  })() : false;

  // Manejar clic en la tarjeta (ver detalles)
  const handleCardClick = () => {
    // Registrar en historial de navegación
    addToHistory(numericId);
    
    // Registrar en motor de recomendaciones
    trackProductView(numericId, category || '', price);
    
    // Ejecutar función onClick personalizada si existe
    if (onClick) {
      onClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    setIsAddingToCart(true);
    addToCart(product);
    
    // Reset del estado de animación
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    toggleWishlist(product);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    toggleCompare(product);
  };

  return (
    <article 
      className={`${styles.card} card`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      {/* Contenedor de imagen con overlay para hover */}
      <div className={styles.imageContainer}>
        {/* Badge "NUEVO" */}
        {isNew && (
          <div className={styles.newBadge}>
            NUEVO
          </div>
        )}

        <img 
          {...imageProps}
          alt={name}
          className={styles.productImage}
        />
        <div className={styles.imageOverlay}>
          <span className={styles.viewDetailsText}>Ver Detalles</span>
        </div>

        {/* Botón de wishlist en la esquina superior derecha */}
        <button
          className={`${styles.wishlistBtn} ${inWishlist ? styles.inWishlist : ''}`}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remover de favoritos' : 'Agregar a favoritos'}
          title={inWishlist ? 'Remover de favoritos' : 'Agregar a favoritos'}
        >
          {inWishlist ? (
            // Corazón lleno
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            // Corazón vacío
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>

        {/* Botón de comparar en la esquina superior izquierda */}
        <button
          className={`${styles.compareBtn} ${inCompare ? styles.inCompare : ''}`}
          onClick={handleToggleCompare}
          aria-label={inCompare ? 'Remover de comparación' : 'Agregar a comparación'}
          title={inCompare ? 'Remover de comparación' : 'Agregar a comparación'}
        >
          {inCompare ? (
            // Balanza llena
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21h18v-2H3v2zM7 8.5c0-1.93 1.57-3.5 3.5-3.5S14 6.57 14 8.5s-1.57 3.5-3.5 3.5S7 10.43 7 8.5zm-4 9h6l-3-5-3 5zm10 0h6l-3-5-3 5z"/>
            </svg>
          ) : (
            // Balanza vacía
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18v-2H3v2z"/>
              <path d="M7 8.5c0-1.93 1.57-3.5 3.5-3.5S14 6.57 14 8.5s-1.57 3.5-3.5 3.5S7 10.43 7 8.5z"/>
              <path d="M1 17.5h6l-3-5-3 5z"/>
              <path d="M17 17.5h6l-3-5-3 5z"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Información del producto */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{name}</h3>
        
        {/* Rating del producto */}
        {averageRating > 0 && (
          <div className={styles.productRating}>
            <StarRating 
              rating={averageRating} 
              size="small" 
              showText={true}
              totalReviews={productRating?.totalReviews || 0}
            />
          </div>
        )}
        
        <p className={styles.productPrice}>
          {price.toLocaleString("es-CL", { 
            style: "currency", 
            currency: "CLP" 
          })}
        </p>

        {/* Botón de agregar al carrito */}
        <button
          className={`${styles.addToCartBtn} ${isAddingToCart ? styles.adding : ''}`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          aria-label={`Agregar ${name} al carrito`}
        >
          {isAddingToCart ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.loadingIcon}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Agregando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </article>
  );
}
