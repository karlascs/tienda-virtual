'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from "@/components/Header";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CheckoutButton from "@/components/CheckoutButton";
import SessionDebug from "@/components/SessionDebug";
import GuestCheckoutForm, { CheckoutData } from "@/components/GuestCheckoutForm";
import ShippingOptions from "@/components/ShippingOptions";
import styles from './CartPage.module.css';

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
  const { data: session } = useSession();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(3000);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  const isDataComplete = checkoutData !== null;

  const handleShippingSelected = (price: number, option: any) => {
    setShippingCost(price);
    setSelectedShipping(option);
  };

  if (state.items.length === 0) {
    return (
      <>
        <Header />
        <SessionDebug />
        
        <main>
          <div className={styles.emptyContainer}>
            <h1 className={styles.title}>
              Carrito de Compras
            </h1>
            
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '48px 24px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" style={{ marginBottom: '24px' }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#1a1a1a', 
                marginBottom: '16px' 
              }}>
                Tu carrito está vacío
              </h2>
              <p className={styles.emptyMessage}>
                ¡Agrega productos desde nuestras categorías!
              </p>
              
              <Link 
                href="/products/hogar"
                className={styles.backLink}
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
      <SessionDebug />
      
      <main>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Tu Carrito de Compras
          </h1>
          
          <div className={styles.cartGrid}>
            {/* Lista de productos */}
            <div className={styles.cartItems}>
              {state.items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  {/* Imagen del producto */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className={styles.itemImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.svg';
                    }}
                  />
                  
                  {/* Información del producto */}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '14px',
                      marginBottom: '12px' 
                    }}>
                      {item.description}
                    </p>
                    <div className={styles.itemPrice}>
                      ${item.price.toLocaleString('es-CL')} c/u
                    </div>
                  </div>
                  
                  {/* Controles de cantidad */}
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => updateQuantity(
                          typeof item.id === 'number' ? item.id : parseInt(item.id), 
                          item.quantity - 1
                        )}
                        className={styles.quantityButton}
                      >
                        −
                      </button>
                      
                      <span className={styles.quantity}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(
                          typeof item.id === 'number' ? item.id : parseInt(item.id), 
                          item.quantity + 1
                        )}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(
                        typeof item.id === 'number' ? item.id : parseInt(item.id)
                      )}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={clearCart}
                className={styles.clearButton}
              >
                Vaciar Carrito
              </button>
            </div>
            
            {/* Resumen del pedido */}
            <div className={styles.cartSummary}>
              <h3 className={styles.summaryTitle}>
                Resumen del Pedido
              </h3>
              
              {/* Nuevo formulario de checkout con validación */}
              <GuestCheckoutForm onDataComplete={setCheckoutData} />
              
              {/* Opciones de envío con Chilexpress */}
              {checkoutData && (
                <ShippingOptions
                  commune={checkoutData.city}
                  city={checkoutData.city}
                  region={checkoutData.region}
                  cartTotal={state.total}
                  cartItems={state.items}
                  onShippingSelected={handleShippingSelected}
                />
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>
                    Productos ({state.itemCount})
                  </span>
                  <span className={styles.summaryValue}>
                    ${state.total.toLocaleString('es-CL')}
                  </span>
                </div>
                
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Envío</span>
                  <span className={styles.summaryValue}>
                    ${shippingCost.toLocaleString('es-CL')}
                  </span>
                </div>
                
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel} style={{ fontSize: '13px' }}>
                    Comisión Transbank (2.95%)
                  </span>
                  <span className={styles.summaryValue} style={{ fontSize: '13px' }}>
                    ${Math.round((state.total + shippingCost) * 0.0295 * 1.19).toLocaleString('es-CL')}
                  </span>
                </div>
                
                <hr style={{ 
                  border: 'none', 
                  borderTop: '1px solid var(--border-color)',
                  margin: '16px 0'
                }} />
                
                <div className={styles.summaryTotal}>
                  <span className={styles.totalLabel}>Total a Pagar</span>
                  <span className={styles.totalValue}>
                    ${Math.round(state.total + shippingCost + ((state.total + shippingCost) * 0.0295 * 1.19)).toLocaleString('es-CL')}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--text-secondary)', 
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  (IVA incluido en precios)
                </div>
              </div>
              
              <CheckoutButton
                cartItems={state.items.map(item => ({
                  productId: item.id, // Pasar directamente, CheckoutButton lo convierte
                  quantity: item.quantity,
                  price: item.price
                }))}
                shippingAddress={checkoutData ? {
                  street: checkoutData.street,
                  city: checkoutData.city,
                  region: checkoutData.region
                } : { street: '', city: '', region: '' }}
                userName={checkoutData?.name}
                userEmail={checkoutData?.email}
                userPhone={checkoutData?.phone}
                userRut={checkoutData?.rut}
                disabled={!isDataComplete}
              />
              
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