import ProductCard from "./ProductCard";

const MOCK = [
  { name: "Auriculares X1", price: 34990, image: "/next.svg" },
  { name: "Teclado Mecánico K84", price: 59990, image: "/vercel.svg" },
  { name: "Mouse Pro M7", price: 25990, image: "/next.svg" },
  { name: "Webcam HD C920", price: 42990, image: "/vercel.svg" },
];

export default function ProductGrid() {
  return (
    <section className="container">
      <h2>Productos</h2>
      <div className="grid">
        {MOCK.map((p, i) => <ProductCard key={i} {...p} />)}
      </div>
    </section>
  );
}
