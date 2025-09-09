import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ProductGrid />
      </main>
      <footer className="container" style={{opacity:.7,padding:"24px 24px 48px"}}>
        © 2025 MiTienda.cl — Fase 1 (MVP estático)
      </footer>
    </>
  );
}
