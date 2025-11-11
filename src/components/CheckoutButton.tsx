'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './CheckoutButton.module.css';

interface CheckoutButtonProps {
  cartItems: Array<{
    productId: string | number; // Aceptar ambos tipos
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    region: string;
  };
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRut?: string;
  disabled?: boolean;
  className?: string;
}

export default function CheckoutButton({
  cartItems,
  shippingAddress,
  userName,
  userEmail,
  userPhone,
  userRut,
  disabled = false,
  className = ''
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: String(item.productId), // Siempre convertir a string para Prisma
            quantity: item.quantity,
            price: item.price
          })),
          shippingName: userName || session?.user?.name || 'Cliente',
          shippingEmail: userEmail || session?.user?.email || '',
          shippingPhone: userPhone || '',
          shippingRut: userRut || '',
          shippingAddress: shippingAddress.street,
          shippingCity: shippingAddress.city,
          shippingRegion: shippingAddress.region,
          shippingZip: '',
        }),
      });

      const data = await response.json();
      
      console.log('📦 Respuesta completa de la API:', data);
      console.log('🔍 Status:', response.status);

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
      }

      // Los datos vienen en data.transbank
      const token = data.transbank?.token || data.token;
      const url = data.transbank?.url || data.url;
      
      console.log('🔍 URL recibida:', url);
      console.log('🔍 Token recibido:', token);

      // Redirigir a Webpay
      if (url && token) {
        const redirectUrl = `${url}?token_ws=${token}`;
        console.log('🚀 Redirigiendo a:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        throw new Error('URL de pago no recibida');
      }
    } catch (err) {
      console.error('Error en checkout:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        onClick={handleCheckout}
        disabled={disabled || loading || cartItems.length === 0 || status === 'loading'}
        className={styles.button}
      >
        {status === 'loading' ? (
          <>
            <span className={styles.spinner}></span>
            Cargando...
          </>
        ) : loading ? (
          <>
            <span className={styles.spinner}></span>
            Procesando...
          </>
        ) : (
          <>
            🛒 Ir a Pagar con Webpay
          </>
        )}
      </button>
      
      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      <div className={styles.securityBadge}>
        🔒 Pago seguro con Transbank
      </div>
    </div>
  );
}
