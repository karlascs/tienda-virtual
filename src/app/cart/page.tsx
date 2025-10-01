'use client';

import Header from "@/components/Header";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

/**
 * Página del Carrito de Compras
 * 
 * Muestra los productos agregados al carrito con funcionalidad completa:
 * - Ver productos en el carrito
 * - Modificar cantidades
 * - Eliminar productos
 * - Ver total del carrito
 * 
 * @returns Página del carrito de compras
 */
export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

  if (state.items.length === 0) {
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
                href="/products/hogar"
                style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}
              >
                Explorar Productos
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main>
        <div className="container" style={{ padding: '40px 24px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            marginBottom: '32px' 
          }}>
            Tu Carrito de Compras 🛒
          </h1>
          
          <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: '1fr 400px' }}>
            {/* Lista de productos */}
            <div>
              {state.items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '16px',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}
                >
                  {/* Imagen del producto */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.svg';
                    }}
                  />
                  
                  {/* Información del producto */}
                  <div>
                    <h3 style={{ 
                      color: 'var(--text-primary)', 
                      marginBottom: '8px',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '14px',
                      marginBottom: '12px' 
                    }}>
                      {item.description}
                    </p>
                    <div style={{ 
                      color: 'var(--brand)', 
                      fontWeight: '700',
                      fontSize: '16px' 
                    }}>
                      ${item.price.toLocaleString('es-CL')} c/u
                    </div>
                  </div>
                  
                  {/* Controles de cantidad */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginBottom: '12px' 
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: 'var(--brand)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        −
                      </button>
                      
                      <span style={{ 
                        fontWeight: '600', 
                        fontSize: '18px',
                        minWidth: '40px',
                        textAlign: 'center' 
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: 'var(--brand)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginTop: '16px'
                }}
              >
                Vaciar Carrito
              </button>
            </div>
            
            {/* Resumen del pedido */}
            <div style={{
              background: 'var(--card-background)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '120px'
            }}>
              <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: '20px',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                Resumen del Pedido
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Productos ({state.itemCount})
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    ${state.total.toLocaleString('es-CL')}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Envío</span>
                  <span style={{ color: 'green', fontWeight: '600' }}>Gratis</span>
                </div>
                
                <hr style={{ 
                  border: 'none', 
                  borderTop: '1px solid var(--border-color)',
                  margin: '16px 0'
                }} />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: 'var(--brand)' }}>
                    ${state.total.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              
              <button
                style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  width: '100%',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => alert('Funcionalidad de checkout próximamente')}
              >
                Proceder al Pago
              </button>
              
              <Link 
                href="/products/hogar"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: 'var(--brand)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '12px'
                }}
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}