import ProductCard from "./ProductCard";

/**
 * Datos de productos mock para la demo
 * En futuras fases, estos datos vendrán de una API o base de datos
 */
const MOCK = [
  { name: "Auriculares X1", price: 34990, image: "/next.svg" },
  { name: "Teclado Mecánico K84", price: 59990, image: "/vercel.svg" },
  { name: "Mouse Pro M7", price: 25990, image: "/next.svg" },
  { name: "Webcam HD C920", price: 42990, image: "/vercel.svg" },
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
