import ProductCard from "./ProductCard";

/**
 * Datos de productos mock para la demo
 * En futuras fases, estos datos vendrán de una API o base de datos
 */
const MOCK = [
  { name: "Hervidor Eléctrico 1.7L", price: 29990, image: "/images/hogar/hervidor-electrico.webp" },
  { name: "Batidora", price: 59990, image: "/images/hogar/batidora-inmersion.avif" },
  { name: "Batidora Inmersión", price: 25990, image: "/images/hogar/batidora-inmersion.avif" },
  { name: "Horno Eléctrico", price: 42990, image: "/images/hogar/horno-electrico.jpg" },
];

/**
 * Componente ProductGrid
 * 
 * Grid responsivo que muestra todos los productos disponibles.
 * 
 * Características:
 * - Layout CSS Grid responsivo
 * - Auto-ajuste de columnas (mínimo 220px)
 * - Datos mock integrados
 * - HTML semántico con <section>
 * - Mapeo eficiente de productos
 * 
 * Futuras mejoras:
 * - Integración con API
 * - Paginación
 * - Filtros y búsqueda
 * - Loading states
 */
export default function ProductGrid() {
  return (
    <section className="container">
      {/* Título de la sección */}
      <h2>Productos</h2>
      
      {/* Grid responsivo de productos */}
      <div className="grid">
        {MOCK.map((product, index) => (
          <ProductCard 
            key={index} 
            {...product} // Spread de todas las propiedades del producto
          />
        ))}
      </div>
    </section>
  );
}
