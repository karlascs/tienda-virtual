import Header from "@/components/Header";
import Link from "next/link";

/**
 * Página del Carrito de Compras
 * 
 * Muestra los productos agregados al carrito
 * En la Fase 1 (MVP estático) solo muestra un mensaje
 * 
 * @returns Página del carrito de compras
 */
export default function CartPage() {
  return (
    <>
      <Header />
      
      <main>
        <div className="container" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            marginBottom: '24px'
          }}>
            Carrito de Compras
          </h1>
          
          <div style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '48px 24px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ 
              fontSize: '24px', 
              color: 'var(--text-primary)', 
              marginBottom: '16px' 
            }}>
              Tu carrito está vacío
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '32px',
              fontSize: '16px' 
            }}>
              ¡Agrega productos desde nuestras categorías!
            </p>
            <Link 
              href="/" 
              style={{
                background: 'var(--primary-color)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </main>
      
      <footer 
        className="container" 
        style={{
          opacity: 0.7, 
          padding: "24px 24px 48px"
        }}
      >
        © 2025 Casa Viva.cl — hecho por karla cuevas
      </footer>
    </>
  );
}