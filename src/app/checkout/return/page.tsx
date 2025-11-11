/**
 * Página de Retorno de Webpay
 * /checkout/return - Transbank redirige aquí después del pago
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './CheckoutReturn.module.css';

function CheckoutReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');
      
      if (!token) {
        setStatus('error');
        setError('Token de pago no encontrado');
        return;
      }

      try {
        console.log('Confirmando pago con token:', token);

        const response = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_ws: token }),
        });

        const data = await response.json();

        if (data.success && data.approved) {
          setStatus('success');
          setOrderData(data);
          
          // Redirigir a página de éxito después de 2 segundos
          setTimeout(() => {
            router.push(`/checkout/success?order=${data.order.orderNumber}`);
          }, 2000);
        } else {
          setStatus('error');
          setError(data.error || 'El pago fue rechazado');
        }
      } catch (error) {
        console.error('Error al confirmar pago:', error);
        setStatus('error');
        setError('Error al procesar el pago');
      }
    };

    confirmPayment();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner}></div>
          <h1 className={styles.title}>Procesando Pago</h1>
          <p className={styles.message}>
            Estamos confirmando tu pago con el banco...
          </p>
          <p className={styles.warning}>
            ⚠️ No cierres esta ventana ni presiones el botón atrás
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.errorIcon}>❌</div>
          <h1 className={styles.title}>Pago Rechazado</h1>
          <p className={styles.message}>{error}</p>
          <div className={styles.actions}>
            <button
              onClick={() => router.push('/cart')}
              className={styles.button}
            >
              Volver al Carrito
            </button>
            <button
              onClick={() => router.push('/')}
              className={styles.buttonSecondary}
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.title}>¡Pago Exitoso!</h1>
          <p className={styles.message}>
            Tu pago ha sido procesado correctamente
          </p>
          <div className={styles.orderInfo}>
            <p><strong>Orden:</strong> {orderData?.order?.orderNumber}</p>
            <p><strong>Total:</strong> ${orderData?.order?.total?.toLocaleString('es-CL')}</p>
          </div>
          <p className={styles.redirect}>
            Redirigiendo a la página de confirmación...
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner}></div>
          <h1 className={styles.title}>Cargando...</h1>
        </div>
      </div>
    }>
      <CheckoutReturnContent />
    </Suspense>
  );
}
